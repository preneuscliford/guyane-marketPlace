"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Shield,
  Eye,
  EyeOff,
  Trash2,
  Ban,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  FileText,
  Briefcase,
  RotateCcw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Report {
  id: string;
  reporter_id: string;
  reported_content_type: string;
  reported_content_id: string;
  reported_user_id: string;
  reason: string;
  description: string;
  status: string;
  moderator_id: string;
  moderator_notes: string;
  created_at: string;
  updated_at: string;
  reporter: {
    username: string;
    email: string;
  };
  reported_user: {
    username: string;
    email: string;
  };
}

interface ModerationAction {
  action_type: "hide" | "delete" | "ban_user" | "warn_user" | "restore";
  reason: string;
  notes?: string;
  duration_hours?: number;
}

const REPORT_REASONS = {
  spam: "Spam ou contenu indésirable",
  harassment: "Harcèlement ou intimidation",
  hate_speech: "Discours de haine",
  violence: "Violence ou menaces",
  inappropriate: "Contenu inapproprié",
  misinformation: "Désinformation",
  copyright: "Violation de droits d'auteur",
  fraud: "Fraude ou escroquerie",
  other: "Autre",
};

const CONTENT_TYPE_ICONS = {
  post: MessageSquare,
  comment: MessageSquare,
  announcement: FileText,
  service: Briefcase,
  user: User,
};

/**
 * Dashboard de modération pour les administrateurs
 */
export default function ModerationDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [filterContentType, setFilterContentType] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [actionForm, setActionForm] = useState<ModerationAction>({
    action_type: "hide",
    reason: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // S'assurer que le modal est fermé au montage du composant
  useEffect(() => {
    setActionModalOpen(false);
    setSelectedReport(null);
  }, []);

  /**
   * Charge les signalements
   */
  /**
   * Charge la liste des signalements avec gestion d'erreur gracieuse
   */
  const fetchReports = async () => {
    try {
      // Requête simple sans jointures pour éviter les erreurs RLS
      let query = supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      if (filterContentType !== "all") {
        query = query.eq("reported_content_type", filterContentType);
      }

      if (filterDateRange !== "all") {
        const now = new Date();
        let startDate: Date;

        switch (filterDateRange) {
          case "today":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            );
            break;
          case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            startDate = new Date(0);
        }

        query = query.gte("created_at", startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.warn("Erreur lors du chargement des signalements:", error);
        setReports([]);
      } else {
        // Enrichir les données avec les informations des utilisateurs
        const enrichedReports = await Promise.all(
          (data || []).map(async (report) => {
            try {
              // Récupérer les infos du rapporteur
              const { data: reporter } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", report.reporter_id)
                .single();

              // Récupérer les infos de l'utilisateur signalé
              const { data: reportedUser } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", report.reported_user_id)
                .single();

              return {
                ...report,
                reporter: reporter || { username: "Utilisateur inconnu" },
                reported_user: reportedUser || {
                  username: "Utilisateur inconnu",
                },
              };
            } catch (err) {
              console.warn(
                "Erreur lors de l'enrichissement du signalement:",
                err
              );
              return {
                ...report,
                reporter: { username: "Utilisateur inconnu" },
                reported_user: { username: "Utilisateur inconnu" },
              };
            }
          })
        );
        setReports(enrichedReports);
      }
    } catch (error) {
      console.warn("Table reports non disponible:", error);
      setReports([]);
      // Ne pas afficher d'erreur à l'utilisateur pour une table manquante
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus, filterContentType, filterDateRange]);

  /**
   * Ouvre le modal d'action pour un signalement
   */
  const openActionModal = (report: Report) => {
    if (!report) {
      return;
    }
    setSelectedReport(report);
    setActionForm({
      action_type: "hide",
      reason: "",
      notes: "",
    });
    setActionModalOpen(true);
  };

  /**
   * Ferme le modal d'action
   */
  const closeActionModal = () => {
    setActionModalOpen(false);
    setSelectedReport(null);
    setActionForm({
      action_type: "hide",
      reason: "",
      notes: "",
    });
    setIsSubmitting(false);
  };

  /**
   * Exécute une action de modération
   */
  const executeAction = async () => {
    if (!selectedReport || !user || !actionForm.reason.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      // Enregistrer l'action de modération
      const { error: actionError } = await supabase
        .from("moderation_actions")
        .insert({
          moderator_id: user.id,
          target_content_type: selectedReport.reported_content_type,
          target_content_id: selectedReport.reported_content_id,
          target_user_id: selectedReport.reported_user_id,
          action_type: actionForm.action_type,
          reason: actionForm.reason,
          notes: actionForm.notes,
          duration_hours: actionForm.duration_hours,
        });

      if (actionError) throw actionError;

      // Appliquer l'action selon le type
      await applyModerationAction(selectedReport, actionForm);

      // Mettre à jour le statut du signalement
      const { error: reportError } = await supabase
        .from("reports")
        .update({
          status: "resolved",
          moderator_id: user.id,
          moderator_notes: actionForm.notes,
        })
        .eq("id", selectedReport.id);

      if (reportError) throw reportError;

      toast.success("Action de modération appliquée avec succès");
      closeActionModal();
      fetchReports();
    } catch (error) {
      console.error("Erreur lors de l'action de modération:", error);
      toast.error("Erreur lors de l'application de l'action");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Applique l'action de modération sur le contenu
   */
  const applyModerationAction = async (
    report: Report,
    action: ModerationAction
  ) => {
    const { reported_content_type, reported_content_id, reported_user_id } =
      report;

    switch (action.action_type) {
      case "hide":
        // Masquer le contenu
        if (
          ["post", "comment", "announcement", "service"].includes(
            reported_content_type
          )
        ) {
          const tableName =
            reported_content_type === "post"
              ? "posts"
              : reported_content_type === "comment"
              ? "comments"
              : reported_content_type === "announcement"
              ? "announcements"
              : "services";

          await supabase
            .from(tableName)
            .update({
              is_hidden: true,
              hidden_by: user?.id,
              hidden_at: new Date().toISOString(),
              hidden_reason: action.reason,
            })
            .eq("id", reported_content_id);
        }
        break;

      case "delete":
        // Supprimer le contenu
        if (
          ["post", "comment", "announcement", "service"].includes(
            reported_content_type
          )
        ) {
          const tableName =
            reported_content_type === "post"
              ? "posts"
              : reported_content_type === "comment"
              ? "comments"
              : reported_content_type === "announcement"
              ? "announcements"
              : "services";

          await supabase.from(tableName).delete().eq("id", reported_content_id);
        }
        break;

      case "ban_user":
        // Bannir l'utilisateur
        await supabase.from("banned_users").insert({
          user_id: reported_user_id,
          banned_by: user?.id,
          reason: action.reason,
          banned_until: action.duration_hours
            ? new Date(
                Date.now() + action.duration_hours * 60 * 60 * 1000
              ).toISOString()
            : null,
        });
        break;

      case "restore":
        // Restaurer le contenu
        if (
          ["post", "comment", "announcement", "service"].includes(
            reported_content_type
          )
        ) {
          const tableName =
            reported_content_type === "post"
              ? "posts"
              : reported_content_type === "comment"
              ? "comments"
              : reported_content_type === "announcement"
              ? "announcements"
              : "services";

          await supabase
            .from(tableName)
            .update({
              is_hidden: false,
              hidden_by: null,
              hidden_at: null,
              hidden_reason: null,
            })
            .eq("id", reported_content_id);
        }
        break;
    }
  };

  /**
   * Rejette un signalement
   */
  const dismissReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({
          status: "dismissed",
          moderator_id: user?.id,
        })
        .eq("id", reportId);

      if (error) {
        console.warn("Erreur lors du rejet du signalement:", error);
        toast.error("Erreur lors du rejet du signalement");
        return;
      }

      toast.success("Signalement rejeté");
      fetchReports();
    } catch (error) {
      console.warn("Erreur lors du rejet du signalement:", error);
      toast.error("Erreur lors du rejet du signalement");
    }
  };

  /**
   * Obtient l'icône pour le type de contenu
   */
  const getContentIcon = (contentType: string) => {
    const IconComponent =
      CONTENT_TYPE_ICONS[contentType as keyof typeof CONTENT_TYPE_ICONS] ||
      FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  /**
   * Obtient le badge de statut
   */
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "En attente",
        variant: "secondary" as const,
        icon: Clock,
      },
      reviewed: { label: "Examiné", variant: "default" as const, icon: Eye },
      resolved: {
        label: "Résolu",
        variant: "default" as const,
        icon: CheckCircle,
      },
      dismissed: {
        label: "Rejeté",
        variant: "destructive" as const,
        icon: XCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal-600" />
            Modération
          </h1>
          <p className="text-gray-600">
            Gérez les signalements et modérez le contenu
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="reviewed">Examinés</SelectItem>
              <SelectItem value="resolved">Résolus</SelectItem>
              <SelectItem value="dismissed">Rejetés</SelectItem>
              <SelectItem value="all">Tous les statuts</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterContentType}
            onValueChange={setFilterContentType}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type de contenu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post">Publications</SelectItem>
              <SelectItem value="comment">Commentaires</SelectItem>
              <SelectItem value="announcement">Annonces</SelectItem>
              <SelectItem value="service">Services</SelectItem>
              <SelectItem value="all">Tous les types</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDateRange} onValueChange={setFilterDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="all">Toutes les dates</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setFilterStatus("all");
              setFilterContentType("all");
              setFilterDateRange("all");
            }}
            className="px-4"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Indicateur du nombre de résultats */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
        <span className="text-sm text-gray-600">
          {reports.length === 0
            ? "Aucun signalement trouvé"
            : `${reports.length} signalement${
                reports.length > 1 ? "s" : ""
              } trouvé${reports.length > 1 ? "s" : ""}`}
        </span>
        {(filterStatus !== "all" ||
          filterContentType !== "all" ||
          filterDateRange !== "all") && (
          <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded">
            Filtres actifs
          </span>
        )}
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {filterStatus !== "all" ||
                  filterContentType !== "all" ||
                  filterDateRange !== "all"
                    ? "Aucun signalement ne correspond aux filtres sélectionnés"
                    : "Aucun signalement trouvé"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getContentIcon(report.reported_content_type)}
                    <div>
                      <CardTitle className="text-lg">
                        {REPORT_REASONS[
                          report.reason as keyof typeof REPORT_REASONS
                        ] || report.reason}
                      </CardTitle>
                      <CardDescription>
                        Signalé par <strong>{report.reporter.username}</strong>{" "}
                        •{" "}
                        {formatDistanceToNow(new Date(report.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type de contenu:</span>
                      <span className="ml-2 capitalize">
                        {report.reported_content_type}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Utilisateur signalé:</span>
                      <span className="ml-2">
                        {report.reported_user.username}
                      </span>
                    </div>
                  </div>

                  {report.description && (
                    <div>
                      <span className="font-medium text-sm">Description:</span>
                      <p className="mt-1 text-gray-600">{report.description}</p>
                    </div>
                  )}

                  {report.status === "pending" && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => openActionModal(report)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Prendre une action
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => dismissReport(report.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  )}

                  {report.moderator_notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-sm">
                        Notes du modérateur:
                      </span>
                      <p className="mt-1 text-gray-600">
                        {report.moderator_notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal d'action de modération */}
      {actionModalOpen && selectedReport && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              closeActionModal();
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Action de modération
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Choisissez l'action à appliquer pour ce signalement
              </DialogDescription>
              {selectedReport && (
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Signalement:</span>{" "}
                    {REPORT_REASONS[
                      selectedReport.reason as keyof typeof REPORT_REASONS
                    ] || selectedReport.reason}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Utilisateur signalé:</span>{" "}
                    {selectedReport.reported_user?.username ||
                      "Utilisateur inconnu"}
                  </div>
                </div>
              )}
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Type d'action
                </Label>
                <Select
                  value={actionForm.action_type}
                  onValueChange={(value) =>
                    setActionForm((prev) => ({
                      ...prev,
                      action_type: value as any,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hide">
                      <div className="flex items-center gap-3 py-1">
                        <EyeOff className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="font-medium">Masquer le contenu</div>
                          <div className="text-xs text-gray-500">
                            Le contenu sera caché mais pas supprimé
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="delete">
                      <div className="flex items-center gap-3 py-1">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="font-medium">
                            Supprimer le contenu
                          </div>
                          <div className="text-xs text-gray-500">
                            Le contenu sera définitivement supprimé
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="ban_user">
                      <div className="flex items-center gap-3 py-1">
                        <Ban className="h-4 w-4 text-red-600" />
                        <div>
                          <div className="font-medium">
                            Bannir l'utilisateur
                          </div>
                          <div className="text-xs text-gray-500">
                            L'utilisateur ne pourra plus accéder à la plateforme
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="warn_user">
                      <div className="flex items-center gap-3 py-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <div>
                          <div className="font-medium">
                            Avertir l'utilisateur
                          </div>
                          <div className="text-xs text-gray-500">
                            Envoyer un avertissement sans autre action
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="restore">
                      <div className="flex items-center gap-3 py-1">
                        <Eye className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">
                            Restaurer le contenu
                          </div>
                          <div className="text-xs text-gray-500">
                            Rendre le contenu visible à nouveau
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {actionForm.action_type === "ban_user" && (
                <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Label className="text-sm font-medium text-red-800">
                    Durée du bannissement (heures)
                  </Label>
                  <Input
                    type="number"
                    placeholder="Laisser vide pour un bannissement permanent"
                    value={actionForm.duration_hours || ""}
                    onChange={(e) =>
                      setActionForm((prev) => ({
                        ...prev,
                        duration_hours: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    className="border-red-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <p className="text-xs text-red-600">
                    ⚠️ Un bannissement permanent ne peut pas être annulé
                    automatiquement
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Raison <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Décrivez la raison de cette action de modération"
                  value={actionForm.reason}
                  onChange={(e) =>
                    setActionForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  required
                  className={`${
                    !actionForm.reason ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {!actionForm.reason && (
                  <p className="text-xs text-red-500">
                    Ce champ est obligatoire
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Notes (optionnel)
                </Label>
                <Textarea
                  placeholder="Ajoutez des notes additionnelles pour documenter cette action..."
                  value={actionForm.notes}
                  onChange={(e) =>
                    setActionForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={closeActionModal}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Annuler
              </Button>
              <Button
                onClick={executeAction}
                disabled={isSubmitting || !actionForm.reason}
                className={`flex-1 sm:flex-none ${
                  actionForm.action_type === "ban_user" ||
                  actionForm.action_type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : actionForm.action_type === "restore"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Application...
                  </div>
                ) : (
                  "Appliquer l'action"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
