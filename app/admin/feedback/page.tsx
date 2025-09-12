"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Eye
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Feedback {
  id: string;
  user_id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  page_url: string;
  browser_info: string;
  admin_response?: string;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    email: string;
  };
}

const FEEDBACK_TYPES = {
  bug: { label: "Bug", icon: Bug, color: "text-red-600" },
  feature: { label: "Fonctionnalité", icon: Lightbulb, color: "text-blue-600" },
  feedback: { label: "Commentaire", icon: MessageSquare, color: "text-green-600" },
  complaint: { label: "Plainte", icon: AlertTriangle, color: "text-orange-600" }
};

const STATUS_CONFIG = {
  pending: { label: "En attente", variant: "secondary" as const, icon: Clock },
  in_progress: { label: "En cours", variant: "default" as const, icon: Eye },
  resolved: { label: "Résolu", variant: "default" as const, icon: CheckCircle },
  dismissed: { label: "Rejeté", variant: "destructive" as const, icon: XCircle }
};

/**
 * Page d'administration des feedbacks
 * Permet aux administrateurs de voir et gérer tous les feedbacks reçus
 */
export default function AdminFeedbackPage() {
  const { user, loading: authLoading } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérification des permissions admin
  useEffect(() => {
    if (!authLoading && (!user || user.profile?.role !== 'admin')) {
      redirect('/');
    }
  }, [user, authLoading]);

  // Chargement des feedbacks
  useEffect(() => {
    if (user?.profile?.role === 'admin') {
      fetchFeedbacks();
    }
  }, [user, filterStatus, filterType]);

  /**
   * Récupère tous les feedbacks avec filtres
   */
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('feedback')
        .select(`
          *,
          profiles!feedback_user_id_fkey (
            username,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;

      setFeedbacks(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des feedbacks:', error);
      toast.error('Erreur lors du chargement des feedbacks');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Met à jour le statut d'un feedback
   */
  const updateFeedbackStatus = async (feedbackId: string, status: string, response?: string) => {
    try {
      setIsSubmitting(true);
      
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (response) {
        updateData.admin_response = response;
      }

      const { error } = await supabase
        .from('feedback')
        .update(updateData)
        .eq('id', feedbackId);

      if (error) throw error;

      toast.success('Feedback mis à jour avec succès');
      fetchFeedbacks();
      setResponseModalOpen(false);
      setSelectedFeedback(null);
      setAdminResponse("");
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Ouvre le modal de réponse
   */
  const openResponseModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminResponse(feedback.admin_response || "");
    setResponseModalOpen(true);
  };

  /**
   * Filtre les feedbacks selon le terme de recherche
   */
  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      feedback.title.toLowerCase().includes(searchLower) ||
      feedback.description.toLowerCase().includes(searchLower) ||
      feedback.profiles.username.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Obtient l'icône pour le type de feedback
   */
  const getTypeIcon = (type: string) => {
    const config = FEEDBACK_TYPES[type as keyof typeof FEEDBACK_TYPES];
    if (!config) return <MessageSquare className="h-4 w-4" />;
    const IconComponent = config.icon;
    return <IconComponent className={`h-4 w-4 ${config.color}`} />;
  };

  /**
   * Obtient le badge de statut
   */
  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-teal-600" />
            Gestion des Feedbacks
          </h1>
          <p className="text-gray-600">Gérez les commentaires et suggestions des utilisateurs</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans les feedbacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="resolved">Résolus</SelectItem>
            <SelectItem value="dismissed">Rejetés</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="bug">Bugs</SelectItem>
            <SelectItem value="feature">Fonctionnalités</SelectItem>
            <SelectItem value="feedback">Commentaires</SelectItem>
            <SelectItem value="complaint">Plaintes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des feedbacks */}
      <div className="grid gap-4">
        {filteredFeedbacks.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun feedback trouvé</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(feedback.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{feedback.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>Par {feedback.profiles.username}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true, locale: fr })}</span>
                          {feedback.priority && feedback.type === 'bug' && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className={`
                                ${feedback.priority === 'critical' ? 'border-red-500 text-red-700' :
                                  feedback.priority === 'high' ? 'border-orange-500 text-orange-700' :
                                  feedback.priority === 'medium' ? 'border-yellow-500 text-yellow-700' :
                                  'border-green-500 text-green-700'}
                              `}>
                                Priorité {feedback.priority}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(feedback.status)}
                  </div>

                  <p className="text-gray-700">{feedback.description}</p>

                  {feedback.category && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Catégorie:</span> {feedback.category}
                    </div>
                  )}

                  {feedback.page_url && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Page:</span>
                      <span className="ml-2 break-all">{feedback.page_url}</span>
                    </div>
                  )}

                  {feedback.admin_response && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-medium text-sm text-blue-800">Réponse admin:</span>
                      <p className="mt-1 text-blue-700">{feedback.admin_response}</p>
                    </div>
                  )}

                  {feedback.status === 'pending' && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => openResponseModal(feedback)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Répondre
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateFeedbackStatus(feedback.id, 'in_progress')}
                      >
                        Marquer en cours
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateFeedbackStatus(feedback.id, 'dismissed')}
                      >
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de réponse */}
      <Dialog open={responseModalOpen} onOpenChange={setResponseModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Répondre au feedback</DialogTitle>
            <DialogDescription>
              Rédigez une réponse à ce feedback et mettez à jour son statut
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">{selectedFeedback.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedFeedback.description}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Réponse administrative</label>
                <Textarea
                  placeholder="Rédigez votre réponse..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResponseModalOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={() => selectedFeedback && updateFeedbackStatus(selectedFeedback.id, 'resolved', adminResponse)}
              disabled={isSubmitting || !adminResponse.trim()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isSubmitting ? 'Envoi...' : 'Répondre et résoudre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}