"use client";

import { Header } from "@/components/layout/Header";
import { HelpCircle, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqCategories = [
    {
      title: "Questions générales",
      faqs: [
        {
          question: "Qu'est-ce que mcGuyane ?",
          answer:
            "mcGuyane est la première marketplace de Guyane française dédiée aux services, produits et annonces locales. Nous connectons les particuliers et professionnels du territoire pour faciliter les échanges commerciaux.",
        },
        {
          question: "Comment créer un compte ?",
          answer:
            "Cliquez sur 'S'inscrire' en haut à droite, remplissez le formulaire avec vos informations (email, mot de passe) et confirmez votre email. Vous pouvez également vous connecter via Google pour plus de rapidité.",
        },
        {
          question: "L'inscription est-elle gratuite ?",
          answer:
            "Oui, l'inscription et la création d'un compte sont entièrement gratuites. Vous pouvez publier des annonces et consulter le marketplace sans frais.",
        },
      ],
    },
    {
      title: "Annonces et Services",
      faqs: [
        {
          question: "Comment publier une annonce ?",
          answer:
            "Connectez-vous à votre compte, cliquez sur 'Publier une annonce', remplissez les informations (titre, description, catégorie, prix, photos) et validez. Votre annonce sera visible immédiatement.",
        },
        {
          question: "Combien d'annonces puis-je publier ?",
          answer:
            "Il n'y a pas de limite au nombre d'annonces que vous pouvez publier. Assurez-vous simplement que chaque annonce respecte nos conditions d'utilisation.",
        },
        {
          question: "Comment modifier ou supprimer mon annonce ?",
          answer:
            "Accédez à votre profil, cliquez sur 'Mes annonces', puis sur l'annonce que vous souhaitez modifier ou supprimer. Vous trouverez les options d'édition et de suppression.",
        },
        {
          question: "Combien de temps reste une annonce en ligne ?",
          answer:
            "Par défaut, les annonces restent actives pendant 90 jours. Vous pouvez les renouveler gratuitement depuis votre profil.",
        },
      ],
    },
    {
      title: "Paiement et Sécurité",
      faqs: [
        {
          question: "Comment sont sécurisées les transactions ?",
          answer:
            "Nous recommandons de privilégier les rencontres en personne pour les échanges locaux. Pour les services en ligne, assurez-vous de la fiabilité du vendeur via les avis et évaluations.",
        },
        {
          question: "Quels sont les moyens de paiement acceptés ?",
          answer:
            "Les modes de paiement sont définis entre acheteur et vendeur. Nous recommandons les paiements sécurisés (virement, espèces en main propre) et de toujours demander un reçu.",
        },
        {
          question: "Comment signaler une annonce suspecte ?",
          answer:
            "Sur chaque annonce, vous trouverez un bouton 'Signaler'. Sélectionnez le motif du signalement et notre équipe de modération traitera le cas rapidement.",
        },
      ],
    },
    {
      title: "Marketplace et Catégories",
      faqs: [
        {
          question: "Quelles catégories sont disponibles ?",
          answer:
            "Nous proposons plus de 8 catégories principales : Artisanat, Services, Agriculture, Tourisme, Produits, Restauration, Événements et Bien-être. Chaque catégorie contient de nombreuses sous-catégories.",
        },
        {
          question: "Comment rechercher une annonce spécifique ?",
          answer:
            "Utilisez la barre de recherche en haut de la page. Vous pouvez filtrer par catégorie, localisation, prix et autres critères pour affiner vos résultats.",
        },
        {
          question: "Puis-je sauvegarder mes annonces favorites ?",
          answer:
            "Oui ! Cliquez sur l'icône cœur sur n'importe quelle annonce pour l'ajouter à vos favoris. Retrouvez-les dans votre profil, section 'Favoris'.",
        },
      ],
    },
    {
      title: "Compte et Profil",
      faqs: [
        {
          question: "Comment modifier mes informations de profil ?",
          answer:
            "Accédez à votre profil en cliquant sur votre avatar en haut à droite, puis sélectionnez 'Paramètres'. Vous pourrez y modifier vos informations personnelles, photo de profil et préférences.",
        },
        {
          question: "Comment changer mon mot de passe ?",
          answer:
            "Dans les paramètres de votre compte, section 'Sécurité', vous trouverez l'option pour modifier votre mot de passe. Un email de confirmation vous sera envoyé.",
        },
        {
          question: "Comment supprimer mon compte ?",
          answer:
            "Contactez notre support via la page Contact en indiquant votre souhait de supprimer votre compte. Nous traiterons votre demande dans les 48h. Attention, cette action est irréversible.",
        },
      ],
    },
  ];

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

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
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  Centre d'aide
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
                  Questions Fréquentes
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Trouvez rapidement les réponses à vos questions
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher une question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-4 border-2 border-gray-200 rounded-full hover:border-purple-300 focus:border-purple-500 transition-colors text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Aucune question ne correspond à votre recherche.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {filteredCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-gradient-to-b from-purple-600 to-fuchsia-600 rounded-full" />
                        {category.title}
                      </h2>

                      <div className="space-y-4">
                        {category.faqs.map((faq, faqIndex) => {
                          const globalIndex = categoryIndex * 100 + faqIndex;
                          const isOpen = openIndex === globalIndex;

                          return (
                            <div
                              key={faqIndex}
                              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-purple-200 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                              <button
                                onClick={() =>
                                  setOpenIndex(isOpen ? null : globalIndex)
                                }
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900 pr-4">
                                  {faq.question}
                                </span>
                                <ChevronDown
                                  className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform duration-300 ${
                                    isOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>

                              <div
                                className={`overflow-hidden transition-all duration-300 ${
                                  isOpen ? "max-h-96" : "max-h-0"
                                }`}
                              >
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                  {faq.answer}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Section */}
              <div className="mt-16 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-teal-500 rounded-2xl p-8 text-center text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-3">
                  Vous ne trouvez pas de réponse ?
                </h3>
                <p className="text-purple-100 mb-6">
                  Notre équipe est là pour vous aider
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-full font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
