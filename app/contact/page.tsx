"use client";

import { Header } from "@/components/layout/Header";
import { Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Message envoyé avec succès ! Nous vous répondrons rapidement."
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/20">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-fuchsia-500/10 to-teal-500/10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full shadow-sm mb-6">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  Contactez-nous
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
                  Besoin d'aide ?
                </span>
                <br />
                <span className="text-gray-900">Nous sommes là pour vous</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Notre équipe est disponible pour répondre à toutes vos questions
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Informations de contact
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Téléphone
                          </h3>
                          <a
                            href="tel:0758080570"
                            className="text-teal-600 hover:text-teal-700 font-medium"
                          >
                            07 58 08 05 70
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-fuchsia-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Localisation
                          </h3>
                          <p className="text-gray-600">Guyane française</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-2xl p-8 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-3">Disponibilité</h3>
                    <div className="space-y-2 text-purple-100">
                      <p>Réponse sous 24-48h</p>
                      <p>Du lundi au vendredi</p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Envoyez-nous un message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label
                            htmlFor="name"
                            className="text-sm font-semibold text-gray-900 mb-2 block"
                          >
                            Nom complet *
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Votre nom"
                            className="h-12 border-2 border-gray-200 rounded-lg hover:border-purple-300 focus:border-purple-500 transition-colors"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-semibold text-gray-900 mb-2 block"
                          >
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="votre@email.com"
                            className="h-12 border-2 border-gray-200 rounded-lg hover:border-purple-300 focus:border-purple-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="subject"
                          className="text-sm font-semibold text-gray-900 mb-2 block"
                        >
                          Sujet *
                        </Label>
                        <Input
                          id="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          placeholder="De quoi souhaitez-vous parler ?"
                          className="h-12 border-2 border-gray-200 rounded-lg hover:border-purple-300 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="message"
                          className="text-sm font-semibold text-gray-900 mb-2 block"
                        >
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          required
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          placeholder="Décrivez votre demande en détail..."
                          className="min-h-[200px] border-2 border-gray-200 rounded-lg hover:border-purple-300 focus:border-purple-500 transition-colors resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
