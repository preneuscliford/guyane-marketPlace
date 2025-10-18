"use client";

import { Header } from "@/components/layout/Header";
import { Cookie, Settings, BarChart, Target, Shield } from "lucide-react";

export default function CookiesPage() {
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
                <Cookie className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  Politique de cookies
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
                  Politique de cookies
                </span>
              </h1>

              <p className="text-lg text-gray-600">
                Mise à jour : 18 octobre 2025
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Qu'est-ce qu'un cookie ?
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Un cookie est un petit fichier texte déposé sur votre
                      appareil lors de votre visite sur un site web. Les cookies
                      permettent de mémoriser vos préférences, de faciliter
                      votre navigation et d'améliorer votre expérience
                      utilisateur.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Nous utilisons différents types de cookies sur mcGuyane
                      pour assurer le bon fonctionnement du site, analyser son
                      utilisation et personnaliser votre expérience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Types de cookies */}
              <div className="space-y-8">
                {/* Cookies essentiels */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                          1. Cookies essentiels
                        </h2>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Obligatoires
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        Ces cookies sont nécessaires au fonctionnement du site
                        et ne peuvent pas être désactivés. Ils ne stockent
                        aucune information personnelle identifiable.
                      </p>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Exemples d'utilisation :
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Maintenir votre session de connexion</li>
                        <li>Mémoriser vos paramètres de langue</li>
                        <li>Assurer la sécurité de votre navigation</li>
                        <li>Gérer votre panier d'achat</li>
                        <li>Stocker vos préférences de consentement cookies</li>
                      </ul>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Durée de conservation :</strong> Session ou
                          jusqu'à 1 an
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies de performance */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BarChart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                          2. Cookies de performance
                        </h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Optionnels
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        Ces cookies nous permettent de mesurer et d'analyser la
                        façon dont vous utilisez notre site afin de l'améliorer
                        continuellement.
                      </p>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Exemples d'utilisation :
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                          Compter le nombre de visiteurs et leur provenance
                        </li>
                        <li>Analyser les pages les plus consultées</li>
                        <li>Mesurer le temps passé sur chaque page</li>
                        <li>Identifier les erreurs techniques</li>
                        <li>Comprendre le parcours des utilisateurs</li>
                      </ul>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Services utilisés :</strong> Google Analytics,
                          Plausible Analytics
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Durée de conservation :</strong> Jusqu'à 2 ans
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies de fonctionnalité */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                          3. Cookies de fonctionnalité
                        </h2>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          Optionnels
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        Ces cookies permettent de mémoriser vos choix et de
                        personnaliser votre expérience sur mcGuyane.
                      </p>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Exemples d'utilisation :
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                          Sauvegarder vos préférences d'affichage (thème,
                          grille/liste)
                        </li>
                        <li>Mémoriser vos filtres de recherche</li>
                        <li>Retenir votre ville de référence</li>
                        <li>Personnaliser le contenu affiché</li>
                        <li>Activer les fonctionnalités de chat en direct</li>
                      </ul>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Durée de conservation :</strong> Jusqu'à 1 an
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies publicitaires */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                          4. Cookies publicitaires
                        </h2>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                          Optionnels
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        Ces cookies sont utilisés pour vous proposer des
                        publicités pertinentes et mesurer l'efficacité de nos
                        campagnes marketing.
                      </p>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Exemples d'utilisation :
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                          Afficher des annonces pertinentes basées sur vos
                          intérêts
                        </li>
                        <li>
                          Limiter le nombre de fois où vous voyez une publicité
                        </li>
                        <li>
                          Mesurer l'efficacité des campagnes publicitaires
                        </li>
                        <li>
                          Partager des informations avec nos partenaires
                          publicitaires
                        </li>
                      </ul>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Services utilisés :</strong> Google Ads,
                          Facebook Pixel
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Durée de conservation :</strong> Jusqu'à 13
                          mois
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gestion des cookies */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Gérer vos préférences de cookies
                  </h2>

                  <p className="text-gray-600 mb-6">
                    Vous pouvez à tout moment modifier vos préférences de
                    cookies et choisir ceux que vous acceptez ou refusez.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Sur mcGuyane
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Accédez à vos préférences de cookies via le{" "}
                    <a
                      href="/parametres/pwa"
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      panneau de paramètres
                    </a>{" "}
                    ou cliquez sur l'icône des cookies en bas de page.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Depuis votre navigateur
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Vous pouvez également configurer votre navigateur pour
                    bloquer ou supprimer les cookies :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                    <li>
                      <strong>Chrome :</strong> Paramètres → Confidentialité et
                      sécurité → Cookies
                    </li>
                    <li>
                      <strong>Firefox :</strong> Options → Vie privée et
                      sécurité → Cookies
                    </li>
                    <li>
                      <strong>Safari :</strong> Préférences → Confidentialité →
                      Cookies
                    </li>
                    <li>
                      <strong>Edge :</strong> Paramètres → Cookies et
                      autorisations de site
                    </li>
                  </ul>

                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Attention :</strong> Bloquer tous les cookies
                      peut affecter le fonctionnement de certaines
                      fonctionnalités du site (connexion, panier, préférences).
                    </p>
                  </div>
                </div>

                {/* Cookies tiers */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    6. Cookies tiers
                  </h2>

                  <p className="text-gray-600 mb-4">
                    Certains cookies peuvent être déposés par des services tiers
                    (partenaires, prestataires) pour améliorer nos services. Ces
                    cookies sont soumis aux politiques de confidentialité de ces
                    tiers.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Partenaires principaux :
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      <strong>Google :</strong> Analytics, Ads, Maps
                    </li>
                    <li>
                      <strong>Meta :</strong> Facebook Pixel, Instagram
                    </li>
                    <li>
                      <strong>Supabase :</strong> Hébergement et base de données
                    </li>
                    <li>
                      <strong>Vercel :</strong> Hébergement du site
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-teal-500 rounded-2xl p-8 text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-3">
                    Questions sur les cookies ?
                  </h2>
                  <p className="text-purple-100 mb-6">
                    Pour toute question concernant notre utilisation des
                    cookies, n'hésitez pas à nous contacter.
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-full font-bold hover:bg-gray-50 transition-all duration-300"
                    >
                      Nous contacter
                    </a>
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
