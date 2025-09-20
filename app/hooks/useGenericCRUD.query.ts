'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

// Types génériques pour les opérations CRUD
interface GenericEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

interface FilterParams {
  [key: string]: any;
}

interface SearchParams extends PaginationParams, SortParams {
  filters?: FilterParams;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Configuration pour chaque entité
interface EntityConfig {
  table: string;
  selectColumns?: string;
  relationships?: string[];
  defaultSort?: { column: string; ascending: boolean };
  searchColumns?: string[];
}

/**
 * Factory pour créer des query keys standardisées
 */
export function createEntityKeys(entityName: string) {
  return {
    all: [entityName] as const,
    lists: () => [...createEntityKeys(entityName).all, 'list'] as const,
    list: (params: SearchParams = {}) => [...createEntityKeys(entityName).lists(), params] as const,
    details: () => [...createEntityKeys(entityName).all, 'detail'] as const,
    detail: (id: string) => [...createEntityKeys(entityName).details(), id] as const,
    user: (userId: string) => [...createEntityKeys(entityName).all, 'user', userId] as const,
    infinite: (params: SearchParams = {}) => [...createEntityKeys(entityName).all, 'infinite', params] as const,
  };
}

/**
 * Hook générique pour récupérer une liste paginée d'entités
 */
export function useGenericListQuery<T extends GenericEntity>(
  entityName: string,
  config: EntityConfig,
  params: SearchParams = {},
  options?: UseQueryOptions<PaginatedResponse<T>, Error>
) {
  const keys = createEntityKeys(entityName);
  
  return useQuery({
    queryKey: keys.list(params),
    queryFn: async (): Promise<PaginatedResponse<T>> => {
      console.log(`TanStack Query: Récupération de la liste ${entityName} avec params:`, params);
      
      let query = supabase
        .from(config.table)
        .select(config.selectColumns || '*', { count: 'exact' });

      // Appliquer les filtres
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else if (typeof value === 'string' && value.includes('%')) {
              query = query.ilike(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      // Recherche textuelle
      if (params.search && config.searchColumns) {
        const searchTerms = config.searchColumns.map(col => `${col}.ilike.%${params.search}%`);
        query = query.or(searchTerms.join(','));
      }

      // Tri
      const sortBy = params.sort_by || config.defaultSort?.column || 'created_at';
      const sortOrder = params.sort_order || (config.defaultSort?.ascending ? 'asc' : 'desc');
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error(`TanStack Query: Erreur lors de la récupération de ${entityName}:`, error);
        throw error;
      }

      const response: PaginatedResponse<T> = {
        data: (data as T[]) || [],
        total: count || 0,
        page,
        limit,
        has_more: (count || 0) > page * limit
      };

      console.log(`TanStack Query: ${entityName} récupérés:`, response.data.length, '/', response.total);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes par défaut
    gcTime: 10 * 60 * 1000, // 10 minutes par défaut
    ...options,
  });
}

/**
 * Hook générique pour récupérer une entité par ID
 */
export function useGenericDetailQuery<T extends GenericEntity>(
  entityName: string,
  config: EntityConfig,
  id: string,
  options?: UseQueryOptions<T, Error>
) {
  const keys = createEntityKeys(entityName);
  
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: async (): Promise<T> => {
      console.log(`TanStack Query: Récupération du détail ${entityName} ID:`, id);
      
      const { data, error } = await supabase
        .from(config.table)
        .select(config.selectColumns || '*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`TanStack Query: Erreur lors de la récupération du détail ${entityName}:`, error);
        throw error;
      }

      if (!data) {
        throw new Error(`${entityName} non trouvé`);
      }

      console.log(`TanStack Query: Détail ${entityName} récupéré:`, data);
      return data as T;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes par défaut
    gcTime: 15 * 60 * 1000, // 15 minutes par défaut
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook générique pour récupérer les entités de l'utilisateur connecté
 */
export function useGenericUserQuery<T extends GenericEntity>(
  entityName: string,
  config: EntityConfig,
  options?: UseQueryOptions<T[], Error>
) {
  const { user } = useAuth();
  const keys = createEntityKeys(entityName);
  
  return useQuery({
    queryKey: keys.user(user?.id || ''),
    queryFn: async (): Promise<T[]> => {
      if (!user) throw new Error('Utilisateur non connecté');
      
      console.log(`TanStack Query: Récupération ${entityName} utilisateur:`, user.id);
      
      const { data, error } = await supabase
        .from(config.table)
        .select(config.selectColumns || '*')
        .eq('user_id', user.id)
        .order(config.defaultSort?.column || 'created_at', { 
          ascending: config.defaultSort?.ascending || false 
        });

      if (error) {
        console.error(`TanStack Query: Erreur lors de la récupération ${entityName} utilisateur:`, error);
        throw error;
      }

      console.log(`TanStack Query: ${entityName} utilisateur récupérés:`, data?.length || 0);
      return (data as T[]) || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute - données utilisateur changent plus fréquemment
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
    ...options,
  });
}

/**
 * Hook générique pour créer une entité
 */
export function useGenericCreateMutation<T extends GenericEntity, CreateData>(
  entityName: string,
  config: EntityConfig,
  options?: UseMutationOptions<T, Error, CreateData>
) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const keys = createEntityKeys(entityName);

  return useMutation({
    mutationFn: async (createData: CreateData): Promise<T> => {
      if (!user) throw new Error('Utilisateur non connecté');
      
      console.log(`TanStack Query: Création ${entityName} avec données:`, createData);
      
      // Ajouter automatiquement user_id si l'entité l'utilise
      const dataWithUserId = {
        ...createData,
        ...(config.table !== 'profiles' && { user_id: user.id })
      };
      
      const { data, error } = await supabase
        .from(config.table)
        .insert(dataWithUserId)
        .select(config.selectColumns || '*')
        .single();

      if (error) {
        console.error(`TanStack Query: Erreur lors de la création ${entityName}:`, error);
        throw error;
      }

      console.log(`TanStack Query: ${entityName} créé avec succès:`, data);
      return data as T;
    },
    onSuccess: (newEntity) => {
      console.log(`TanStack Query: Mutation create${entityName} réussie, invalidation du cache`);
      
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: keys.lists() });
      
      // Invalider les entités utilisateur
      if (user) {
        queryClient.invalidateQueries({ queryKey: keys.user(user.id) });
      }
      
      // Ajouter l'entité au cache
      queryClient.setQueryData(keys.detail(newEntity.id), newEntity);
    },
    ...options,
  });
}

/**
 * Hook générique pour mettre à jour une entité
 */
export function useGenericUpdateMutation<T extends GenericEntity, UpdateData>(
  entityName: string,
  config: EntityConfig,
  options?: UseMutationOptions<T, Error, { id: string; data: UpdateData }>
) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const keys = createEntityKeys(entityName);

  return useMutation({
    mutationFn: async ({ id, data: updateData }: { id: string; data: UpdateData }): Promise<T> => {
      console.log(`TanStack Query: Mise à jour ${entityName} ID:`, id, 'avec données:', updateData);
      
      // Construire la query de base
      let query = supabase
        .from(config.table)
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      // Ajouter la contrainte user_id si nécessaire pour la sécurité
      if (user && config.table !== 'profiles') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query
        .select(config.selectColumns || '*')
        .single();

      if (error) {
        console.error(`TanStack Query: Erreur lors de la mise à jour ${entityName}:`, error);
        throw error;
      }

      console.log(`TanStack Query: ${entityName} mis à jour avec succès:`, data);
      return data as T;
    },
    onSuccess: (updatedEntity, { id }) => {
      console.log(`TanStack Query: Mutation update${entityName} réussie, mise à jour du cache`);
      
      // Mettre à jour l'entité spécifique dans le cache
      queryClient.setQueryData(keys.detail(id), updatedEntity);
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: keys.lists() });
      
      // Invalider les entités utilisateur si applicable
      if (user) {
        queryClient.invalidateQueries({ queryKey: keys.user(user.id) });
      }
    },
    ...options,
  });
}

/**
 * Hook générique pour supprimer une entité
 */
export function useGenericDeleteMutation<T extends GenericEntity>(
  entityName: string,
  config: EntityConfig,
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const keys = createEntityKeys(entityName);

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log(`TanStack Query: Suppression ${entityName} ID:`, id);
      
      // Construire la query de base
      let query = supabase
        .from(config.table)
        .delete()
        .eq('id', id);

      // Ajouter la contrainte user_id si nécessaire pour la sécurité
      if (user && config.table !== 'profiles') {
        query = query.eq('user_id', user.id);
      }

      const { error } = await query;

      if (error) {
        console.error(`TanStack Query: Erreur lors de la suppression ${entityName}:`, error);
        throw error;
      }

      console.log(`TanStack Query: ${entityName} supprimé avec succès`);
    },
    onSuccess: (_, id) => {
      console.log(`TanStack Query: Mutation delete${entityName} réussie, nettoyage du cache`);
      
      // Supprimer l'entité du cache
      queryClient.removeQueries({ queryKey: keys.detail(id) });
      
      // Invalider les listes pour refléter la suppression
      queryClient.invalidateQueries({ queryKey: keys.lists() });
      
      // Invalider les entités utilisateur si applicable
      if (user) {
        queryClient.invalidateQueries({ queryKey: keys.user(user.id) });
      }
    },
    ...options,
  });
}

/**
 * Hook composite pour récupérer les opérations CRUD complètes d'une entité
 */
export function useGenericCRUD<T extends GenericEntity, CreateData, UpdateData>(
  entityName: string,
  config: EntityConfig,
  params: SearchParams = {}
) {
  const listQuery = useGenericListQuery<T>(entityName, config, params);
  const userQuery = useGenericUserQuery<T>(entityName, config);
  
  const createMutation = useGenericCreateMutation<T, CreateData>(entityName, config);
  const updateMutation = useGenericUpdateMutation<T, UpdateData>(entityName, config);
  const deleteMutation = useGenericDeleteMutation<T>(entityName, config);
  
  return {
    // Queries
    list: listQuery,
    userItems: userQuery,
    
    // Mutations
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    
    // État global
    isLoading: listQuery.isLoading || userQuery.isLoading || 
               createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    
    // Helpers
    keys: createEntityKeys(entityName),
    
    // Actions
    refetch: listQuery.refetch,
    refetchUser: userQuery.refetch,
  };
}

/**
 * Configurations prédéfinies pour les entités communes
 */
export const entityConfigs = {
  services: {
    table: 'services',
    selectColumns: `
      *,
      profiles!services_user_id_fkey (
        id,
        username,
        full_name,
        avatar_url
      ),
      reviews (
        rating
      )
    `,
    defaultSort: { column: 'created_at', ascending: false },
    searchColumns: ['title', 'description']
  },
  
  advertisements: {
    table: 'advertisements',
    selectColumns: '*',
    defaultSort: { column: 'created_at', ascending: false },
    searchColumns: ['title', 'description']
  },
  
  announcements: {
    table: 'announcements',
    selectColumns: `
      *,
      profiles!announcements_user_id_fkey (
        id,
        username,
        full_name,
        avatar_url
      )
    `,
    defaultSort: { column: 'created_at', ascending: false },
    searchColumns: ['title', 'description']
  },
  
  reviews: {
    table: 'reviews',
    selectColumns: `
      *,
      profiles!reviews_user_id_fkey (
        id,
        username,
        avatar_url
      )
    `,
    defaultSort: { column: 'created_at', ascending: false },
    searchColumns: ['comment']
  },
  
  profiles: {
    table: 'profiles',
    selectColumns: '*',
    defaultSort: { column: 'created_at', ascending: false },
    searchColumns: ['username', 'full_name']
  }
} as const;

/**
 * Hooks spécialisés utilisant les configurations prédéfinies
 */
export const useGenericServices = (params: SearchParams = {}) => 
  useGenericCRUD('services', entityConfigs.services, params);

export const useGenericAdvertisements = (params: SearchParams = {}) => 
  useGenericCRUD('advertisements', entityConfigs.advertisements, params);

export const useGenericAnnouncements = (params: SearchParams = {}) => 
  useGenericCRUD('announcements', entityConfigs.announcements, params);

export const useGenericReviews = (params: SearchParams = {}) => 
  useGenericCRUD('reviews', entityConfigs.reviews, params);