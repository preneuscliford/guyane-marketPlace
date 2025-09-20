"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase, createAuthenticatedClient } from "@/lib/supabase";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import ModerationDashboard from "@/components/admin/ModerationDashboard";
import {
  Shield,
  Users,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  UserX,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  Ban,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ModerationStats {
  total_reports: number;
  pending_reports: number;
  resolved_reports: number;
  banned_users: number;
  hidden_content: number;
  actions_today: number;
}

interface BannedUser {
  id: string;
  user_id: string;
  reason: string;
  banned_at: string;
  banned_until?: string;
  is_permanent: boolean;
  profiles: {
    username: string;
    email: string;
    avatar_url?: string;
  };
}

interface HiddenContent {
  id: string;
  content_type: 'post' | 'comment' | 'service' | 'announcement';
  content_id: string;
  hidden_at: string;
  reason: string;
  content_preview: string;
  author_username: string;
}

interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  location?: string;
  is_banned: boolean;
  ban_reason?: string;
  banned_until?: string;
  is_permanent_ban: boolean;
  warning_count: number;
  moderation_action_count: number;
}

/**
 * Page d'administration pour la modération
 * Accessible uniquement aux administrateurs
 */
export default function ModerationPage() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ModerationStats>({
    total_reports: 0,
    pending_reports: 0,
    resolved_reports: 0,
    banned_users: 0,
    hidden_content: 0,
    actions_today: 0
  });
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [hiddenContent, setHiddenContent] = useState<HiddenContent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'banned' | 'hidden' | 'users'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<number | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningType, setWarningType] = useState('general');
  const [moderationActions, setModerationActions] = useState<any[]>([]);

  /**
   * Vérifie si l'utilisateur est administrateur
   */
  const checkUserRole = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        toast.error('Erreur lors de la vérification du rôle.');
        redirect('/');
        return;
      }

      const role = profile?.role || 'user';
      setUserRole(role);
      
      if (role !== 'admin') {
        toast.error('Accès refusé. Vous devez être administrateur.');
        redirect('/');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle:', error);
      redirect('/');
    }
  };

  /**
   * Charge les actions de modération
   */
  const fetchModerationActions = async () => {
    try {
      const response = await fetch('/api/admin/moderation-actions');
      if (response.ok) {
        const data = await response.json();
        setModerationActions(data);
      } else {
        console.warn('Erreur lors du chargement des actions de modération');
        setModerationActions([]);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des actions de modération:', error);
      setModerationActions([]);
    }
  };

  /**
   * Charge les statistiques de modération avec gestion d'erreur gracieuse
   */
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.warn('Erreur lors du chargement des statistiques');
        // Utiliser des valeurs par défaut en cas d'erreur
        setStats({
          total_reports: 0,
          pending_reports: 0,
          resolved_reports: 0,
          banned_users: 0,
          hidden_content: 0,
          actions_today: 0
        });
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des statistiques:', error);
      // Utiliser des valeurs par défaut en cas d'erreur
      setStats({
        total_reports: 0,
        pending_reports: 0,
        resolved_reports: 0,
        banned_users: 0,
        hidden_content: 0,
        actions_today: 0
      });
    }
  };

  /**
   * Charge la liste des utilisateurs bannis
   */
  /**
   * Charge la liste des utilisateurs bannis avec gestion d'erreur gracieuse
   */
  const fetchBannedUsers = async () => {
    try {
      const response = await fetch('/api/admin/banned-users');
      if (response.ok) {
        const data = await response.json();
        setBannedUsers(data.data || []);
      } else {
        console.warn('Erreur lors du chargement des utilisateurs bannis');
        setBannedUsers([]);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des utilisateurs bannis:', error);
      setBannedUsers([]);
    }
  };

  /**
   * Charge la liste du contenu masqué
   */
  const fetchHiddenContent = async () => {
    try {
      const response = await fetch('/api/admin/hidden-content');
      if (response.ok) {
        const data = await response.json();
        setHiddenContent(data.data || []);
      } else {
        console.warn('Erreur lors du chargement du contenu masqué');
        setHiddenContent([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du contenu masqué:', error);
      setHiddenContent([]);
    }
  };

  /**
   * Débannit un utilisateur
   */
  const unbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('banned_users')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Utilisateur débanni avec succès');
      fetchBannedUsers();
      fetchStats();
    } catch (error) {
      console.error('Erreur lors du déban:', error);
      toast.error('Erreur lors du déban');
    }
  };

  /**
   * Restaure du contenu masqué
   */
  const restoreContent = async (contentType: string, contentId: string) => {
    try {
      const { error } = await supabase
        .from(contentType === 'post' ? 'posts' : 
              contentType === 'comment' ? 'comments' :
              contentType === 'service' ? 'services' : 'announcements')
        .update({ is_hidden: false })
        .eq('id', contentId);

      if (error) throw error;

      toast.success('Contenu restauré avec succès');
      fetchHiddenContent();
      fetchStats();
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      toast.error('Erreur lors de la restauration');
    }
  };

  /**
   * Charge la liste des utilisateurs avec leurs informations de modération
   */
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      } else {
        console.warn('Erreur lors du chargement des utilisateurs');
        setUsers([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setUsers([]);
    }
  };

  /**
   * Bannit un ou plusieurs utilisateurs
   */
  const banUsers = async () => {
    if (selectedUsers.length === 0 || !banReason.trim()) {
      toast.error('Veuillez sélectionner des utilisateurs et fournir une raison');
      return;
    }

    try {
      const adminClient = createAdminClient();
      if (!adminClient) {
        toast.error('Erreur d\'authentification');
        return;
      }

      for (const userId of selectedUsers) {
        const { error } = await adminClient.rpc('ban_user', {
          p_user_id: userId,
          p_moderator_id: user?.id,
          p_reason: banReason,
          p_duration_hours: banDuration
        });

        if (error) throw error;
      }

      toast.success(`${selectedUsers.length} utilisateur(s) banni(s) avec succès`);
      setSelectedUsers([]);
      setBanReason('');
      setBanDuration(null);
      setShowBanModal(false);
      fetchUsers();
      fetchBannedUsers();
      fetchStats();
    } catch (error) {
      console.error('Erreur lors du bannissement:', error);
      toast.error('Erreur lors du bannissement');
    }
  };

  /**
   * Envoie un avertissement à un ou plusieurs utilisateurs
   */
  const sendWarnings = async () => {
    if (selectedUsers.length === 0 || !warningMessage.trim()) {
      toast.error('Veuillez sélectionner des utilisateurs et fournir un message');
      return;
    }

    try {
      const response = await fetch('/api/admin/send-warning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          moderatorId: user?.id,
          warningType,
          message: warningMessage
        })
      });

      if (response.ok) {
        toast.success(`Avertissement envoyé à ${selectedUsers.length} utilisateur(s)`);
        setSelectedUsers([]);
        setWarningMessage('');
        setWarningType('general');
        setShowWarningModal(false);
        fetchUsers();
      } else {
        toast.error('Erreur lors de l\'envoi d\'avertissement');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi d\'avertissement:', error);
      toast.error('Erreur lors de l\'envoi d\'avertissement');
    }
  };

  /**
   * Filtre les utilisateurs selon la recherche
   */
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (user) {
      checkUserRole();
    }
  }, [user]);

  useEffect(() => {
    if (userRole === 'admin' && user && user.profile) {
      // Ajouter un délai pour s'assurer que l'authentification est complète
      const timer = setTimeout(async () => {
        // Vérifier que la session Supabase est active avant de lancer les requêtes
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          fetchStats();
          fetchBannedUsers();
          fetchHiddenContent();
          fetchUsers();
          fetchModerationActions();
        } else {
          console.warn('Session Supabase non active, tentative de reconnexion...');
          // Attendre un peu plus et réessayer
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession && retrySession.user) {
              fetchStats();
              fetchBannedUsers();
              fetchHiddenContent();
              fetchUsers();
              fetchModerationActions();
            }
          }, 1000);
        }
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [userRole, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-8 w-8 text-red-600" />
                Administration - Modération
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les signalements, les utilisateurs bannis et le contenu masqué
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.pending_reports}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_reports}</div>
                <div className="text-sm text-gray-600">Total signalements</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.resolved_reports}</div>
                <div className="text-sm text-gray-600">Résolus</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.banned_users}</div>
                <div className="text-sm text-gray-600">Utilisateurs bannis</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.hidden_content}</div>
                <div className="text-sm text-gray-600">Contenu masqué</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600">{stats.actions_today}</div>
                <div className="text-sm text-gray-600">Actions aujourd'hui</div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex space-x-1 mt-6">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Signalements
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => setActiveTab('users')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Gestion utilisateurs ({users.length})
            </Button>
            <Button
              variant={activeTab === 'banned' ? 'default' : 'outline'}
              onClick={() => setActiveTab('banned')}
              className="flex items-center gap-2"
            >
              <UserX className="h-4 w-4" />
              Utilisateurs bannis ({stats.banned_users})
            </Button>
            <Button
              variant={activeTab === 'hidden' ? 'default' : 'outline'}
              onClick={() => setActiveTab('hidden')}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Contenu masqué ({stats.hidden_content})
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tableau de bord des signalements */}
        {activeTab === 'dashboard' && (
          <ModerationDashboard onStatsUpdate={fetchStats} />
        )}

        {/* Liste des utilisateurs bannis */}
        {activeTab === 'banned' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Utilisateurs bannis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bannedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun utilisateur banni</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bannedUsers.map((bannedUser) => (
                    <div key={bannedUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {bannedUser.profiles.avatar_url ? (
                            <img 
                              src={bannedUser.profiles.avatar_url} 
                              alt={bannedUser.profiles.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{bannedUser.profiles.username}</div>
                          <div className="text-sm text-gray-500">{bannedUser.profiles.email}</div>
                          <div className="text-sm text-gray-500">
                            Banni {formatDistanceToNow(new Date(bannedUser.banned_at), { addSuffix: true, locale: fr })}
                          </div>
                          <div className="text-sm text-red-600">Raison: {bannedUser.reason}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={bannedUser.is_permanent ? 'destructive' : 'secondary'}>
                          {bannedUser.is_permanent ? 'Permanent' : 'Temporaire'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unbanUser(bannedUser.user_id)}
                        >
                          Débannir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Gestion des utilisateurs */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestion des utilisateurs
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Rechercher un utilisateur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    {selectedUsers.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowWarningModal(true)}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Avertir ({selectedUsers.length})
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowBanModal(true)}
                          className="flex items-center gap-2"
                        >
                          <Ban className="h-4 w-4" />
                          Bannir ({selectedUsers.length})
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.avatar_url ? (
                              <img 
                                src={user.avatar_url} 
                                alt={user.username || 'Utilisateur'}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <Users className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{user.username || 'Utilisateur sans nom'}</div>
                              {user.is_banned && (
                                <Badge variant="destructive">Banni</Badge>
                              )}
                              {user.role && user.role !== 'user' && (
                                <Badge variant="secondary">{user.role}</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{user.full_name}</div>
                            {user.location && (
                              <div className="text-sm text-gray-500">{user.location}</div>
                            )}
                            <div className="text-xs text-gray-400">
                              Inscrit {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: fr })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {user.warning_count > 0 && (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              {user.warning_count} avertissement(s)
                            </div>
                          )}
                          {user.moderation_action_count > 0 && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4 text-red-500" />
                              {user.moderation_action_count} action(s)
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Liste du contenu masqué */}
        {activeTab === 'hidden' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeOff className="h-5 w-5" />
                Contenu masqué
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hiddenContent.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun contenu masqué</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hiddenContent.map((content) => (
                    <div key={`${content.content_type}-${content.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {content.content_type === 'post' ? 'Post' :
                             content.content_type === 'comment' ? 'Commentaire' :
                             content.content_type === 'service' ? 'Service' : 'Annonce'}
                          </Badge>
                          <span className="text-sm text-gray-500">par {content.author_username}</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">{content.content_preview}</div>
                        <div className="text-xs text-gray-500">
                          Masqué {formatDistanceToNow(new Date(content.hidden_at), { addSuffix: true, locale: fr })}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreContent(content.content_type, content.content_id)}
                        className="ml-4"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Restaurer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de bannissement */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                Bannir {selectedUsers.length} utilisateur(s)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason('');
                  setBanDuration('');
                }}
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Raison du bannissement</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Expliquez la raison du bannissement..."
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Durée du bannissement</label>
                <select
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Sélectionner une durée</option>
                  <option value="1">1 jour</option>
                  <option value="3">3 jours</option>
                  <option value="7">1 semaine</option>
                  <option value="30">1 mois</option>
                  <option value="90">3 mois</option>
                  <option value="365">1 an</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason('');
                  setBanDuration('');
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={banUsers}
                disabled={!banReason.trim() || !banDuration}
                className="flex-1"
              >
                <Ban className="h-4 w-4 mr-2" />
                Bannir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'avertissement */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                Avertir {selectedUsers.length} utilisateur(s)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningMessage('');
                  setWarningType('warning');
                }}
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type d'avertissement</label>
                <select
                  value={warningType}
                  onChange={(e) => setWarningType(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="warning">Avertissement</option>
                  <option value="final_warning">Avertissement final</option>
                  <option value="notice">Notice</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message d'avertissement</label>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="Rédigez votre message d'avertissement..."
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningMessage('');
                  setWarningType('warning');
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="default"
                onClick={sendWarnings}
                disabled={!warningMessage.trim()}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}