"use client";

import { Header } from "@/components/layout/Header";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

export default function PrivacyPage() {
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
                <Shield className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  Politique de confidentialité
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
                  Votre vie privée
                </span>
                <br />
                <span className="text-gray-900">est notre priorité</span>
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
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Introduction
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Chez mcGuyane, nous nous engageons à protéger vos données
                      personnelles et à respecter votre vie privée. Cette
                      politique de confidentialité explique quelles données nous
                      collectons, comment nous les utilisons, et vos droits
                      concernant ces informations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {/* Données collectées */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Database className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        1. Données collectées
                      </h2>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Informations que vous nous fournissez
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                        <li>
                          Informations de compte (nom, prénom, email, téléphone)
                        </li>
                        <li>
                          Informations de profil (photo, biographie,
                          localisation)
                        </li>
                        <li>
                          Contenus publiés (annonces, commentaires, messages)
                        </li>
                        <li>Informations de paiement (si applicable)</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Données collectées automatiquement
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                          Données de navigation (pages visitées, durée, actions)
                        </li>
                        <li>
                          Informations techniques (adresse IP, navigateur,
                          appareil)
                        </li>
                        <li>Cookies et technologies similaires</li>
                        <li>Données de localisation (si autorisé)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Utilisation des données */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Eye className="w-6 h-6 text-fuchsia-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        2. Utilisation des données
                      </h2>

                      <p className="text-gray-600 mb-4">
                        Nous utilisons vos données pour :
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Créer et gérer votre compte utilisateur</li>
                        <li>Fournir et améliorer nos services</li>
                        <li>
                          Personnaliser votre expérience sur la plateforme
                        </li>
                        <li>Traiter les transactions et communications</li>
                        <li>Assurer la sécurité et prévenir la fraude</li>
                        <li>Respecter nos obligations légales</li>
                        <li>
                          Vous envoyer des notifications et informations
                          importantes
                        </li>
                        <li>
                          Analyser l'utilisation de la plateforme pour
                          l'améliorer
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Partage des données */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        3. Partage des données
                      </h2>

                      <p className="text-gray-600 mb-4">
                        Nous ne vendons jamais vos données personnelles. Nous
                        pouvons partager vos informations avec :
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                          <strong>Autres utilisateurs :</strong> Informations de
                          profil public et annonces
                        </li>
                        <li>
                          <strong>Prestataires de services :</strong>{" "}
                          Hébergement, paiement, analytics (sous contrat strict)
                        </li>
                        <li>
                          <strong>Autorités légales :</strong> Si requis par la
                          loi ou pour protéger nos droits
                        </li>
                        <li>
                          <strong>Partenaires commerciaux :</strong> Avec votre
                          consentement explicite uniquement
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Sécurité */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        4. Sécurité de vos données
                      </h2>

                      <p className="text-gray-600 mb-4">
                        Nous mettons en œuvre des mesures de sécurité techniques
                        et organisationnelles pour protéger vos données :
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Chiffrement des données sensibles (SSL/TLS)</li>
                        <li>
                          Authentification sécurisée et mots de passe hashés
                        </li>
                        <li>Accès restreint aux données personnelles</li>
                        <li>Surveillance et tests de sécurité réguliers</li>
                        <li>
                          Sauvegardes automatiques et plan de reprise d'activité
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Vos droits */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        5. Vos droits (RGPD)
                      </h2>

                      <p className="text-gray-600 mb-4">
                        Conformément au RGPD, vous disposez des droits suivants
                        :
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                          <strong>Droit d'accès :</strong> Consulter les données
                          que nous détenons sur vous
                        </li>
                        <li>
                          <strong>Droit de rectification :</strong> Corriger vos
                          données inexactes ou incomplètes
                        </li>
                        <li>
                          <strong>Droit à l'effacement :</strong> Demander la
                          suppression de vos données
                        </li>
                        <li>
                          <strong>Droit à la portabilité :</strong> Recevoir vos
                          données dans un format structuré
                        </li>
                        <li>
                          <strong>Droit d'opposition :</strong> Vous opposer au
                          traitement de vos données
                        </li>
                        <li>
                          <strong>Droit de limitation :</strong> Limiter le
                          traitement de vos données
                        </li>
                      </ul>
                      <p className="text-gray-600 mt-4">
                        Pour exercer ces droits, contactez-nous à{" "}
                        <a
                          href="mailto:privacy@mcguyane.com"
                          className="text-purple-600 hover:text-purple-700 font-semibold"
                        >
                          privacy@mcguyane.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cookies */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    6. Cookies
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience.
                    Consultez notre{" "}
                    <a
                      href="/cookies"
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      Politique de cookies
                    </a>{" "}
                    pour plus d'informations.
                  </p>
                </div>

                {/* Conservation */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    7. Conservation des données
                  </h2>
                  <p className="text-gray-600">
                    Nous conservons vos données personnelles aussi longtemps que
                    nécessaire pour fournir nos services et respecter nos
                    obligations légales. Les données de compte sont conservées
                    tant que votre compte est actif. Après suppression du
                    compte, certaines données peuvent être conservées pour des
                    raisons légales (5 ans maximum).
                  </p>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-teal-500 rounded-2xl p-8 text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-3">
                    Questions sur la confidentialité ?
                  </h2>
                  <p className="text-purple-100 mb-6">
                    Pour toute question concernant cette politique de
                    confidentialité ou vos données personnelles, utilisez notre
                    formulaire de contact.
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
