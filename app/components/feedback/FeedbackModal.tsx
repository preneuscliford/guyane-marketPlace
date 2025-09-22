"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageSquare, Bug, Lightbulb, Heart, Send, Flag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const FEEDBACK_TYPES = {
  bug: {
    label: "Signaler un bug",
    description: "Quelque chose ne fonctionne pas comme prévu",
    icon: Bug,
    color: "text-red-600",
  },
  feature_request: {
    label: "Demande de fonctionnalité",
    description: "Suggérer une nouvelle fonctionnalité",
    icon: Lightbulb,
    color: "text-yellow-600",
  },
  improvement: {
    label: "Amélioration",
    description: "Améliorer une fonctionnalité existante",
    icon: Heart,
    color: "text-pink-600",
  },
  other: {
    label: "Autre",
    description: "Autre type de feedback",
    icon: MessageSquare,
    color: "text-blue-600",
  },
};

const CATEGORIES = {
  ui_ux: "Interface utilisateur",
  performance: "Performance",
  functionality: "Fonctionnalité",
  content: "Contenu",
  accessibility: "Accessibilité",
  mobile: "Version mobile",
  other: "Autre",
};

const PRIORITIES = {
  low: "Faible",
  medium: "Moyenne",
  high: "Élevée",
  critical: "Critique",
};

export default function FeedbackModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [form, setForm] = useState({
    type: "",
    category: "",
    title: "",
    description: "",
    priority: "medium",
    page_url: "",
    browser_info: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      const user = (data as any)?.user;
      setIsAuthenticated(!!user);
    };
    checkAuth();
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!(session as any)?.user);
      }
    );
    // subscription has unsubscribe function inside subscription
    return () => {
      try {
        (subscription as any)?.subscription?.unsubscribe?.();
      } catch (e) {
        void e;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setForm((prev) => ({
        ...prev,
        page_url: window.location.href,
        browser_info: navigator.userAgent,
      }));
    }
  }, []);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      window.location.href = "/auth";
      return;
    }
    setOpen(true);
  };

  const resetForm = () => {
    setForm({
      type: "",
      category: "",
      title: "",
      description: "",
      priority: "medium",
      page_url: typeof window !== "undefined" ? window.location.href : "",
      browser_info: typeof window !== "undefined" ? navigator.userAgent : "",
    });
  };

  const submitFeedback = async () => {
    if (!form.type || !form.title || !form.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = (data as any)?.user;
      if (!user) {
        toast.error("Vous devez être connecté pour envoyer un feedback");
        return;
      }
      const { error } = await supabase.from("feedback").insert({
        type: form.type,
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: "open",
        user_id: user.id,
      });
      if (error) throw error;
      toast.success("Feedback envoyé avec succès !");
      setOpen(false);
      resetForm();
    } catch (err) {
      // Log the error for debugging and show a friendly toast
      console.error(err);
      toast.error("Erreur lors de l'envoi du feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div onClick={handleOpenModal}>{children}</div>
      {open && (
        <Dialog>
          <DialogContent
            className="w-11/12 max-w-2xl max-h-[80vh] rounded-2xl p-0 overflow-hidden"
            onClose={() => setOpen(false)}
          >
            <div className="px-4 sm:px-6 pt-5 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50  border-b rounded-t-2xl">
              <div className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-gray-900">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Envoyer un feedback
              </div>
              <div className="text-sm sm:text-base text-gray-700 pt-2">
                Aidez-nous à améliorer la plateforme
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitFeedback();
              }}
            >
              <div className="px-4 sm:px-6 pt-5 pb-4  overflow-y-auto  space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">
                    Type de feedback *
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(FEEDBACK_TYPES).map(([key, config]) => {
                      const IconComponent = (config as any).icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateForm("type", key)}
                          className={`group p-4 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                            form.type === key
                              ? "border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 shadow-md"
                              : "border-gray-200 hover:border-teal-300 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg transition-colors ${
                                form.type === key
                                  ? "bg-teal-200"
                                  : "bg-gray-100 group-hover:bg-teal-100"
                              }`}
                            >
                              <IconComponent
                                className={`h-5 w-5 ${
                                  form.type === key
                                    ? "text-teal-700"
                                    : (config as any).color
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3
                                className={`font-semibold text-sm ${
                                  form.type === key
                                    ? "text-teal-900"
                                    : "text-gray-900"
                                }`}
                              >
                                {(config as any).label}
                              </h3>
                              <p
                                className={`text-xs mt-1 ${
                                  form.type === key
                                    ? "text-teal-700"
                                    : "text-gray-600"
                                }`}
                              >
                                {(config as any).description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">
                    Catégorie
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(value: string) =>
                      updateForm("category", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-lg hover:border-teal-300 focus:border-teal-500 transition-colors">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">
                    Titre *
                  </Label>
                  <Input
                    value={form.title}
                    onChange={(e: any) => updateForm("title", e.target.value)}
                    placeholder="Résumé en quelques mots"
                    className="h-12 border-2 border-gray-200 rounded-lg hover:border-teal-300 focus:border-teal-500 transition-colors"
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {form.title.length}/100
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">
                    Description *
                  </Label>
                  <Textarea
                    value={form.description}
                    onChange={(e: any) =>
                      updateForm("description", e.target.value)
                    }
                    placeholder="Décrivez votre feedback en détail..."
                    className="min-h-[120px] border-2 border-gray-200 rounded-lg hover:border-teal-300 focus:border-teal-500 transition-colors resize-none"
                    maxLength={1000}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {form.description.length}/1000
                  </div>
                </div>
                {form.type === "bug" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-900">
                      Priorité
                    </Label>
                    <Select
                      value={form.priority}
                      onValueChange={(value: string) =>
                        updateForm("priority", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-lg hover:border-teal-300 focus:border-teal-500 transition-colors">
                        <SelectValue placeholder="Sélectionnez une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITIES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  key === "critical"
                                    ? "bg-red-500"
                                    : key === "high"
                                    ? "bg-orange-500"
                                    : key === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                              />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {form.type === "bug" && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <svg
                          className="h-4 w-4 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-blue-900">
                        Informations techniques (automatiques)
                      </span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                        <span className="font-semibold text-blue-800">
                          Page actuelle:
                        </span>
                        <div className="text-blue-700 mt-1 break-all font-mono">
                          {form.page_url}
                        </div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                        <span className="font-semibold text-blue-800">
                          Navigateur:
                        </span>
                        <div className="text-blue-700 mt-1 break-all font-mono text-xs">
                          {form.browser_info}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !form.type ||
                    !form.title ||
                    !form.description
                  }
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer le feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
