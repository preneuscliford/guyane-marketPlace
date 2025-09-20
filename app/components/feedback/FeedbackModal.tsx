"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Imports Dialog supprimés car nous utilisons maintenant un modal personnalisé
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Bug, Lightbulb, Heart, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Types de feedback disponibles avec leurs configurations
 */
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

/**
 * Catégories de feedback disponibles
 */
const CATEGORIES = {
  ui_ux: "Interface utilisateur",
  performance: "Performance",
  functionality: "Fonctionnalité",
  content: "Contenu",
  accessibility: "Accessibilité",
  mobile: "Version mobile",
  other: "Autre",
};

/**
 * Niveaux de priorité pour les bugs
 */
const PRIORITIES = {
  low: "Faible",
  medium: "Moyenne",
  high: "Élevée",
  critical: "Critique",
};

/**
 * Interface pour le formulaire de feedback
 */
interface FeedbackForm {
  type: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  page_url: string;
  browser_info: string;
}

/**
 * Props du composant FeedbackModal
 */
interface FeedbackModalProps {
  children: React.ReactNode;
}

/**
 * Composant modal pour envoyer des feedbacks
 * Permet aux utilisateurs de signaler des bugs, demander des fonctionnalités, etc.
 */
export default function FeedbackModal({ children }: FeedbackModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [form, setForm] = useState<FeedbackForm>({
    type: "",
    category: "",
    title: "",
    description: "",
    priority: "medium",
    page_url: "",
    browser_info: "",
  });

  /**
   * Vérifie l'authentification de l'utilisateur au chargement
   */
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Initialise les informations techniques au chargement
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      setForm(prev => ({
        ...prev,
        page_url: window.location.href,
        browser_info: navigator.userAgent,
      }));
    }
  }, []);

  /**
   * Met à jour un champ du formulaire
   */
  const updateForm = (field: keyof FeedbackForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Gère l'ouverture du modal avec vérification d'authentification
   */
  const handleOpenModal = () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      window.location.href = '/auth';
      return;
    }
    setOpen(true);
  };

  /**
   * Réinitialise le formulaire
   */
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

  /**
   * Soumet le feedback
   */
  const submitFeedback = async () => {
    if (!form.type || !form.title || !form.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

     try {
      // Récupérer l'utilisateur actuel
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Erreur d'authentification:", authError);
        toast.error("Vous devez être connecté pour envoyer un feedback");
        return;
      }
      
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

      if (error) {
        console.error("Erreur Supabase:", error);
        throw new Error(`Erreur base de données: ${error.message}`);
      }

      toast.success("Feedback envoyé avec succès !");
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(`Erreur lors de l'envoi du feedback: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Obtient l'icône pour un type de feedback
   */
  const getTypeIcon = (type: string) => {
    const typeConfig = FEEDBACK_TYPES[type as keyof typeof FEEDBACK_TYPES];
    if (!typeConfig) return null;
    
    const IconComponent = typeConfig.icon;
    return <IconComponent className={`h-5 w-5 ${typeConfig.color}`} />;
  };

  return (
    <>
      <div onClick={handleOpenModal}>
        {children}
      </div>
      
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Envoyer un feedback
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Aidez-nous à améliorer la plateforme
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Type de feedback */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">Type de feedback *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(FEEDBACK_TYPES).map(([key, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateForm('type', key)}
                          className={`group p-4 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                            form.type === key
                              ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 shadow-md'
                              : 'border-gray-200 hover:border-teal-300 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                              form.type === key ? 'bg-teal-200' : 'bg-gray-100 group-hover:bg-teal-100'
                            }`}>
                              <IconComponent className={`h-5 w-5 ${
                                form.type === key ? 'text-teal-700' : config.color
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold text-sm ${
                                form.type === key ? 'text-teal-900' : 'text-gray-900'
                              }`}>
                                {config.label}
                              </h3>
                              <p className={`text-xs mt-1 ${
                                form.type === key ? 'text-teal-700' : 'text-gray-600'
                              }`}>
                                {config.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Catégorie */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">Catégorie</Label>
                  <Select value={form.category} onValueChange={(value) => updateForm('category', value)}>
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

                {/* Titre */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">Titre *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    placeholder="Résumé en quelques mots"
                    className="h-12 border-2 border-gray-200 rounded-lg hover:border-teal-300 focus:border-teal-500 transition-colors"
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {form.title.length}/100
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">Description *</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    placeholder="Décrivez votre feedback en détail..."
                    className="min-h-[120px] border-2 border-gray-200 rounded-lg hover:border-teal-300 focus:border-teal-500 transition-colors resize-none"
                    maxLength={1000}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {form.description.length}/1000
                  </div>
                </div>

                {/* Priorité pour les bugs */}
                {form.type === 'bug' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-900">Priorité</Label>
                    <Select value={form.priority} onValueChange={(value) => updateForm('priority', value)}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-lg hover:border-teal-300 focus:border-teal-500 transition-colors">
                        <SelectValue placeholder="Sélectionnez une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITIES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${
                                key === 'critical' ? 'bg-red-500' :
                                key === 'high' ? 'bg-orange-500' :
                                key === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`} />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Informations techniques */}
                {form.type === 'bug' && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-blue-900">
                        Informations techniques (automatiques)
                      </span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                        <span className="font-semibold text-blue-800">Page actuelle:</span>
                        <div className="text-blue-700 mt-1 break-all font-mono">{form.page_url}</div>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                        <span className="font-semibold text-blue-800">Navigateur:</span>
                        <div className="text-blue-700 mt-1 break-all font-mono text-xs">{form.browser_info}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  Annuler
                </Button>
                <Button
                  onClick={submitFeedback}
                  disabled={isSubmitting || !form.type || !form.title || !form.description}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6"
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
