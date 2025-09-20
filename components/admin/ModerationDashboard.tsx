"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  UserX,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Flag
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Report {
  id: string;
  reported_content_type: 'post' | 'comment' | 'service' | 'announcement' | 'product';
  reported_content_id: string;
  reported_user_id: string;
  reporter_id: string;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at?: string;
  moderator_id?: string;
  moderator_notes?: string;
  reporter_profile?: {
    username: string;
    avatar_url?: string;
  };
  reported_profile?: {
    username: string;
    avatar_url?: string;
  };
}

interface ModerationAction {
  id: string;
  action_type: 'hide_content' | 'ban_user' | 'warn_user' | 'delete_content' | 'unban_user';
  target_user_id: string;
  content_id?: string;
  content_type?: string;
  reason: string;
  moderator_id: string;
  created_at: string;
  moderator?: {
    username: string;
  };
  target_user?: {
    username: string;
  };
}

interface BannedUser {
  id: string;
  user_id: string;
  reason: string;
  banned_by: string;
  banned_until?: string;
  created_at: string;
  banned_user?: {
    username: string;
    email: string;
    avatar_url?: string;
  };
  banned_by_user?: {
    username: string;
  };
}

interface ModerationDashboardProps {
  className?: string;
}

/**
 * Dashboard de modération pour visualiser et gérer les signalements
 */
export default function ModerationDashboard({ className }: ModerationDashboardProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'actions' | 'banned'>('reports');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'post' | 'comment' | 'service' | 'announcement' | 'product'>('all');
  const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Charge les signalements depuis la base de données
   */
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du chargement des signalements');
      }
      
      const { data } = result;
      setReports(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des signalements');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charge les actions de modération depuis la base de données
   */
  const fetchModerationActions = async () => {
    try {
      const response = await fetch('/api/admin/moderation-actions');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du chargement des actions de modération');
      }
      
      const { data } = result;
      setModerationActions(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  /**
   * Charge les utilisateurs bannis depuis la base de données
   */
  const fetchBannedUsers = async () => {
    try {
      const response = await fetch('/api/admin/banned-users');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du chargement des utilisateurs bannis');
      }
      
      const { data } = result;
      setBannedUsers(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  /**
   * Débannit un utilisateur
   */
  const unbanUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/banned-users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du débannissement');
      }

      toast.success('Utilisateur débanni avec succès');
      fetchBannedUsers();
      fetchModerationActions();
    } catch (error) {
      console.error('Erreur lors du débannissement:', error);
      toast.error('Erreur lors du débannissement');
    }
  };

  /**
   * Résout un signalement (approuve ou rejette)
   */
  const resolveReport = async (reportId: string, action: 'approve' | 'dismiss', notes?: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          notes
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la résolution du signalement');
      }

      toast.success(`Signalement ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`);
      fetchReports();
    } catch (error) {
      console.error('Erreur lors de la résolution du signalement:', error);
      toast.error('Erreur lors de la résolution du signalement');
    }
  };

  /**
   * Supprime le contenu signalé
   */
  const deleteContent = async (report: Report, reason: string) => {
    try {
      // Utiliser l'API route pour modérer le contenu
      await moderateContent(report, 'delete');
      
      toast.success('Contenu supprimé avec succès');
      fetchModerationActions();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression du contenu');
    }
  };

  /**
   * Masque ou supprime le contenu signalé
   */
  const moderateContent = async (report: Report, action: 'hide' | 'delete') => {
    try {
      const response = await fetch('/api/admin/moderate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: report.id,
          contentId: report.reported_content_id,
          contentType: report.reported_content_type,
          action,
          reason: report.reason,
          targetUserId: report.reported_user_id
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la modération du contenu');
      }

      toast.success(`Contenu ${action === 'hide' ? 'masqué' : 'supprimé'} avec succès`);
      fetchReports();
      fetchModerationActions();
    } catch (error) {
      console.error('Erreur lors de la modération du contenu:', error);
      toast.error('Erreur lors de la modération du contenu');
    }
  };

  /**
   * Avertit un utilisateur
   */
  const warnUser = async (report: Report, reason: string) => {
    try {
      const response = await fetch('/api/admin/warn-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: report.id,
          targetUserId: report.reported_user_id,
          reason
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'avertissement');
      }

      toast.success('Utilisateur averti avec succès');
      fetchReports();
      fetchModerationActions();
    } catch (error) {
      console.error('Erreur lors de l\'avertissement:', error);
      toast.error('Erreur lors de l\'avertissement');
    }
  };

  /**
   * Bannit un utilisateur
   */
  const banUser = async (report: Report, reason: string, duration?: number) => {
    try {
      const response = await fetch('/api/admin/ban-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: report.id,
          targetUserId: report.reported_user_id,
          reason,
          duration
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du bannissement de l\'utilisateur');
      }
      
      const banType = duration ? `${duration} jours` : 'définitivement';
      toast.success(`Utilisateur banni ${banType} avec succès`);
      fetchReports();
      fetchModerationActions();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du bannissement de l\'utilisateur');
    }
  };

  /**
   * Filtre les signalements selon les critères sélectionnés
   */
  const filteredReports = reports.filter(report => {
    // Filtre par statut
    if (filterStatus !== 'all' && report.status !== filterStatus) return false;
    
    // Filtre par type de contenu
    if (filterType !== 'all' && report.reported_content_type !== filterType) return false;
    
    // Filtre par date
    if (filterDateRange !== 'all') {
      const reportDate = new Date(report.created_at);
      const now = new Date();
      
      switch (filterDateRange) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (reportDate < today) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (reportDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (reportDate < monthAgo) return false;
          break;
      }
    }
    
    // Filtre par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesReason = report.reason.toLowerCase().includes(searchLower);
      const matchesDescription = report.description?.toLowerCase().includes(searchLower);
      const matchesReporter = report.reporter_profile?.username?.toLowerCase().includes(searchLower);
      const matchesReported = report.reported_profile?.username?.toLowerCase().includes(searchLower);
      
      if (!matchesReason && !matchesDescription && !matchesReporter && !matchesReported) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  /**
   * Obtient la couleur du badge selon le statut
   */
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'resolved': return 'default';
      case 'dismissed': return 'secondary';
      default: return 'outline';
    }
  };

  /**
   * Obtient l'icône selon le type de contenu
   */
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <MessageSquare className="h-4 w-4" />;
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'service': return <Flag className="h-4 w-4" />;
      case 'announcement': return <Flag className="h-4 w-4" />;
      case 'product': return <Flag className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchReports(), fetchModerationActions(), fetchBannedUsers()]);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Onglets */}
      <div className="flex space-x-1 mb-6">
        <Button
          variant={activeTab === 'reports' ? 'default' : 'outline'}
          onClick={() => setActiveTab('reports')}
          className="flex items-center gap-2"
        >
          <Flag className="h-4 w-4" />
          Signalements ({reports.length})
        </Button>
        <Button
          variant={activeTab === 'actions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('actions')}
          className="flex items-center gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          Actions de modération ({moderationActions.length})
        </Button>
        <Button
          variant={activeTab === 'banned' ? 'default' : 'outline'}
          onClick={() => setActiveTab('banned')}
          className="flex items-center gap-2"
        >
          <UserX className="h-4 w-4" />
          Utilisateurs bannis ({bannedUsers.length})
        </Button>
      </div>

      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Filtres */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="pending">En attente</option>
                  <option value="resolved">Résolus</option>
                  <option value="dismissed">Rejetés</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de contenu
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="post">Post</option>
                  <option value="comment">Commentaire</option>
                  <option value="service">Service</option>
                  <option value="announcement">Annonce</option>
                  <option value="product">Produit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Bouton pour réinitialiser les filtres */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                  setFilterDateRange('all');
                  setSearchTerm('');
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          {/* Compteur de résultats */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {filteredReports.length} signalement{filteredReports.length !== 1 ? 's' : ''} 
              {filteredReports.length !== reports.length && (
                <span>sur {reports.length} au total</span>
              )}
            </div>
            {filteredReports.length > 0 && (
              <div className="text-sm text-gray-500">
                Triés par date (plus récents en premier)
              </div>
            )}
          </div>

          {/* Liste des signalements */}
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterDateRange !== 'all' 
                      ? 'Aucun signalement ne correspond aux critères de recherche'
                      : 'Aucun signalement trouvé'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getContentTypeIcon(report.reported_content_type)}
                        <div>
                          <CardTitle className="text-lg">
                            Signalement - {report.reported_content_type}
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            Par {report.reporter_profile?.username || 'Utilisateur inconnu'} •{' '}
                            {formatDistanceToNow(new Date(report.created_at), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(report.status)}>
                        {report.status === 'pending' && 'En attente'}
                        {report.status === 'resolved' && 'Résolu'}
                        {report.status === 'dismissed' && 'Rejeté'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">Raison :</p>
                        <p className="text-gray-700">{report.reason}</p>
                      </div>
                      {report.description && (
                        <div>
                          <p className="font-medium">Description :</p>
                          <p className="text-gray-700">{report.description}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">Utilisateur signalé :</p>
                        <p className="text-gray-700">
                          {report.reported_profile?.username || 'Utilisateur inconnu'}
                        </p>
                      </div>
                      
                      {report.status === 'pending' && (
                        <div className="space-y-3 pt-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moderateContent(report, 'hide')}
                              className="flex items-center gap-2"
                            >
                              <EyeOff className="h-4 w-4" />
                              Masquer le contenu
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => moderateContent(report, 'delete')}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer le contenu
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => warnUser(report, report.reason)}
                              className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                            >
                              <AlertTriangle className="h-4 w-4" />
                              Avertir l'utilisateur
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => banUser(report, report.reason, 7)}
                              className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <UserX className="h-4 w-4" />
                              Bannir 7 jours
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => banUser(report, report.reason)}
                              className="flex items-center gap-2 text-red-800 border-red-500 hover:bg-red-100"
                            >
                              <UserX className="h-4 w-4" />
                              Bannir définitivement
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => resolveReport(report.id, 'approve')}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approuver
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => resolveReport(report.id, 'dismiss')}
                              className="flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-4">
          {moderationActions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune action de modération trouvée</p>
              </CardContent>
            </Card>
          ) : (
            moderationActions.map((action) => (
              <Card key={action.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">
                          {action.action_type === 'hide_content' && 'Contenu masqué'}
                          {action.action_type === 'delete_content' && 'Contenu supprimé'}
                          {action.action_type === 'ban_user' && 'Utilisateur banni'}
                          {action.action_type === 'warn_user' && 'Utilisateur averti'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Par {action.moderator?.username || 'Modérateur inconnu'} •{' '}
                          {formatDistanceToNow(new Date(action.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Cible : {action.target_user?.username || 'Utilisateur inconnu'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Raison : {action.reason}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'banned' && (
        <div className="space-y-4">
          {bannedUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun utilisateur banni trouvé</p>
              </CardContent>
            </Card>
          ) : (
            bannedUsers.map((bannedUser) => (
              <Card key={bannedUser.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserX className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">
                          {bannedUser.banned_user?.username || 'Utilisateur inconnu'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {bannedUser.banned_user?.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          Banni par {bannedUser.banned_by_user?.username || 'Modérateur inconnu'} •{' '}
                          {formatDistanceToNow(new Date(bannedUser.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </p>
                        {bannedUser.banned_until && (
                          <p className="text-sm text-orange-600">
                            Jusqu'au {new Date(bannedUser.banned_until).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          {bannedUser.banned_until ? 'Bannissement temporaire' : 'Bannissement permanent'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Raison : {bannedUser.reason}
                        </p>
                      </div>
                      <Button
                        onClick={() => unbanUser(bannedUser.user_id)}
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Débannir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}