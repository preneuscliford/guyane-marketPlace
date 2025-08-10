'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  DollarSign,
  Grid3X3,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { ServiceCard, ServiceCardCompact } from '@/components/services/ServiceCard';
import { useServices, useServiceStats } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import {
  ServiceSearchParams,
  ServiceWithProfile,
  SERVICE_CATEGORIES,
  PRICE_TYPES
} from '@/types/services';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

/**
 * Page principale des services
 */
export default function ServicesPage() {
  const { user } = useAuth();
  const { services, loading, error, fetchServices, deleteService } = useServices();
  const { stats, fetchStats } = useServiceStats();
  const router = useRouter();
  
  // État des filtres
  const [searchParams, setSearchParams] = useState<ServiceSearchParams>({
    search: '',
    category: '',
    location: '',
    price_min: undefined,
    price_max: undefined,
    price_type: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 12
  });
  
  // État pour l'affichage des filtres (avec "all" pour les valeurs vides)
  const [displayFilters, setDisplayFilters] = useState({
    category: 'all',
    price_type: 'all',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearch, setLocalSearch] = useState('');

  // Charger les services et statistiques au montage
  useEffect(() => {
    fetchServices(searchParams);
    fetchStats();
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchParams.search) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  /**
   * Gère la recherche
   */
  const handleSearch = async () => {
    const newParams = { ...searchParams, search: localSearch };
    setSearchParams(newParams);
    await fetchServices(newParams);
  };

  /**
   * Gère le changement de filtre
   */
  const handleFilterChange = async (key: keyof ServiceSearchParams, value: any) => {
    // Mettre à jour l'affichage
    if (key === 'category' || key === 'price_type' || key === 'sort_by' || key === 'sort_order') {
      setDisplayFilters(prev => ({ ...prev, [key]: value }));
    }
    
    // Convertir "all" en chaîne vide pour les filtres API
    const processedValue = value === "all" ? "" : value;
    const newParams = { ...searchParams, [key]: processedValue };
    setSearchParams(newParams);
    await fetchServices(newParams);
  };

  /**
   * Réinitialise les filtres
   */
  const resetFilters = async () => {
    const defaultParams: ServiceSearchParams = {
      search: '',
      category: '',
      location: '',
      price_min: undefined,
      price_max: undefined,
      price_type: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      limit: 12
    };
    const defaultDisplay = {
      category: 'all',
      price_type: 'all',
      sort_by: 'created_at',
      sort_order: 'desc'
    };
    setSearchParams(defaultParams);
    setDisplayFilters(defaultDisplay);
    setLocalSearch('');
    await fetchServices(defaultParams);
  };

  /**
   * Gère le contact avec un prestataire
   */
  const handleContact = (service: ServiceWithProfile) => {
    if (service.contact_info?.phone) {
      window.open(`tel:${service.contact_info.phone}`);
    } else if (service.contact_info?.email) {
      window.open(`mailto:${service.contact_info.email}`);
    } else {
      toast.info('Aucune information de contact disponible');
    }
  };

  /**
   * Gère la modification d'un service
   */
  const handleEdit = (service: ServiceWithProfile) => {
    router.push(`/services/${service.id}/modifier`);
  };

  /**
   * Gère la suppression d'un service
   */
  const handleDelete = async (service: ServiceWithProfile) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      await deleteService(service.id);
      toast.success('Service supprimé avec succès');
      // Rafraîchir la liste
      await fetchServices(searchParams);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du service');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Services</h1>
          <p className="text-gray-600">
            Découvrez les services proposés par la communauté
          </p>
        </div>
        
        {user && (
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/services/nouveau">
              <Plus className="h-4 w-4 mr-2" />
              Proposer un service
            </Link>
          </Button>
        )}
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total_services}
              </div>
              <div className="text-sm text-gray-600">Services total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.active_services}
              </div>
              <div className="text-sm text-gray-600">Services actifs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.total_views}
              </div>
              <div className="text-sm text-gray-600">Vues totales</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.average_rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {/* Recherche principale */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un service..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </Button>
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Catégorie */}
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={displayFilters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all-categories" value="all">Toutes les catégories</SelectItem>
                      {SERVICE_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Localisation */}
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Ville, région..."
                      value={searchParams.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Prix minimum */}
                <div className="space-y-2">
                  <Label>Prix minimum</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={searchParams.price_min || ''}
                      onChange={(e) => handleFilterChange('price_min', parseFloat(e.target.value) || undefined)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Prix maximum */}
                <div className="space-y-2">
                  <Label>Prix maximum</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="1000"
                      value={searchParams.price_max || ''}
                      onChange={(e) => handleFilterChange('price_max', parseFloat(e.target.value) || undefined)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type de prix */}
                <div className="space-y-2">
                  <Label>Type de prix</Label>
                  <Select
                    value={displayFilters.price_type}
                    onValueChange={(value) => handleFilterChange('price_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all-types" value="all">Tous les types</SelectItem>
                      {PRICE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tri */}
                <div className="space-y-2">
                  <Label>Trier par</Label>
                  <Select
                    value={displayFilters.sort_by}
                    onValueChange={(value) => handleFilterChange('sort_by', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="created_at" value="created_at">Date de création</SelectItem>
                      <SelectItem key="title" value="title">Titre</SelectItem>
                      <SelectItem key="price" value="price">Prix</SelectItem>
                      <SelectItem key="views" value="views">Popularité</SelectItem>
                      <SelectItem key="rating" value="rating">Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ordre */}
                <div className="space-y-2">
                  <Label>Ordre</Label>
                  <Select
                    value={displayFilters.sort_order}
                    onValueChange={(value) => handleFilterChange('sort_order', value as 'asc' | 'desc')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="desc" value="desc">Décroissant</SelectItem>
                      <SelectItem key="asc" value="asc">Croissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions des filtres */}
              <div className="flex gap-2">
                <Button onClick={resetFilters} variant="outline" size="sm">
                  Réinitialiser
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des services...</p>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">Erreur: {error}</p>
            <Button onClick={() => fetchServices(searchParams)} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">
              Aucun service trouvé avec ces critères.
            </p>
            <Button onClick={resetFilters} variant="outline">
              Voir tous les services
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {services.map((service) => (
            viewMode === 'grid' ? (
              <ServiceCard
                key={service.id}
                service={service}
                onContact={() => handleContact(service)}
                onEdit={user?.id === service.user_id ? () => handleEdit(service) : undefined}
                onDelete={user?.id === service.user_id ? () => handleDelete(service) : undefined}
              />
            ) : (
              <ServiceCardCompact
                key={service.id}
                service={service}
                onContact={() => handleContact(service)}
                onEdit={user?.id === service.user_id ? () => handleEdit(service) : undefined}
                onDelete={user?.id === service.user_id ? () => handleDelete(service) : undefined}
              />
            )
          ))}
        </div>
      )}

      {/* Pagination */}
      {services.length >= (searchParams.limit || 12) && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => handleFilterChange('limit', (searchParams.limit || 12) + 12)}
            variant="outline"
          >
            Charger plus de services
          </Button>
        </div>
      )}
    </div>
  );
}