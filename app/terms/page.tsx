"use client";

import { Header } from "@/components/layout/Header";
import {
  FileText,
  Scale,
  ShieldCheck,
  AlertTriangle,
  UserX,
  Gavel,
} from "lucide-react";

export default function TermsPage() {
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
                <Scale className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  Conditions d'utilisation
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
                  Conditions d'utilisation
                </span>
                <br />
                <span className="text-gray-900">de mcGuyane</span>
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
                      Acceptation des conditions
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      En accédant et en utilisant mcGuyane, vous acceptez d'être
                      lié par ces conditions d'utilisation. Si vous n'acceptez
                      pas ces conditions, veuillez ne pas utiliser notre
                      plateforme.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {/* Description du service */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        1. Description du service
                      </h2>

                      <p className="text-gray-600 mb-4">
                        mcGuyane est une marketplace en ligne permettant aux
                        utilisateurs de :
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                          Publier et consulter des annonces de produits et
                          services
                        </li>
                        <li>Entrer en contact avec d'autres utilisateurs</li>
                        <li>
                          Échanger des biens et services en Guyane française
                        </li>
                        <li>Participer à la communauté locale</li>
                      </ul>
                      <p className="text-gray-600 mt-4">
                        mcGuyane agit uniquement comme intermédiaire et n'est
                        pas partie aux transactions entre utilisateurs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compte utilisateur */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    2. Compte utilisateur
                  </h2>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Inscription
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                    <li>
                      Vous devez avoir au moins 18 ans pour créer un compte
                    </li>
                    <li>
                      Vous devez fournir des informations exactes et complètes
                    </li>
                    <li>
                      Vous êtes responsable de la confidentialité de votre mot
                      de passe
                    </li>
                    <li>Un compte ne peut pas être transféré à un tiers</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Responsabilités
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Maintenir vos informations de compte à jour</li>
                    <li>Protéger vos identifiants de connexion</li>
                    <li>
                      Nous informer immédiatement de toute utilisation non
                      autorisée
                    </li>
                    <li>
                      Être responsable de toutes les activités sur votre compte
                    </li>
                  </ul>
                </div>

                {/* Règles d'utilisation */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        3. Règles d'utilisation
                      </h2>

                      <p className="text-gray-600 mb-4">
                        <strong>Vous vous engagez à NE PAS :</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                          Publier du contenu illégal, frauduleux ou trompeur
                        </li>
                        <li>
                          Vendre des produits contrefaits, volés ou interdits
                        </li>
                        <li>Usurper l'identité d'une autre personne</li>
                        <li>
                          Harceler, menacer ou intimider d'autres utilisateurs
                        </li>
                        <li>
                          Collecter des informations sur d'autres utilisateurs
                        </li>
                        <li>Utiliser des robots ou des scripts automatisés</li>
                        <li>Tenter de contourner les mesures de sécurité</li>
                        <li>Spammer ou envoyer des messages non sollicités</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contenu utilisateur */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    4. Contenu utilisateur
                  </h2>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Propriété et licence
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vous conservez la propriété de tout contenu que vous
                    publiez. En publiant du contenu, vous accordez à mcGuyane
                    une licence mondiale, non exclusive, gratuite et
                    transférable pour utiliser, reproduire et afficher ce
                    contenu dans le cadre de notre service.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Modération
                  </h3>
                  <p className="text-gray-600">
                    Nous nous réservons le droit de modérer, modifier ou
                    supprimer tout contenu qui viole ces conditions ou que nous
                    jugeons inapproprié, sans préavis.
                  </p>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Transactions entre utilisateurs
                  </h2>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-yellow-800 font-semibold">
                      ⚠️ mcGuyane n'est PAS responsable des transactions entre
                      utilisateurs
                    </p>
                  </div>

                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      Les transactions sont conclues directement entre acheteur
                      et vendeur
                    </li>
                    <li>
                      Nous ne garantissons pas la qualité, sécurité ou légalité
                      des produits/services
                    </li>
                    <li>
                      Nous ne sommes pas responsables des litiges entre
                      utilisateurs
                    </li>
                    <li>
                      Vous devez faire preuve de prudence et de bon sens dans
                      vos transactions
                    </li>
                    <li>
                      Privilégiez les rencontres en lieu public et les paiements
                      sécurisés
                    </li>
                  </ul>
                </div>

                {/* Limitation de responsabilité */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    6. Limitation de responsabilité
                  </h2>

                  <p className="text-gray-600 mb-4">
                    mcGuyane est fourni "en l'état" sans garantie d'aucune
                    sorte. Nous ne garantissons pas :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                    <li>
                      La disponibilité ininterrompue ou sans erreur du service
                    </li>
                    <li>L'exactitude ou la fiabilité du contenu utilisateur</li>
                    <li>La sécurité absolue des données</li>
                    <li>L'absence de virus ou autres composants nuisibles</li>
                  </ul>

                  <p className="text-gray-600 font-semibold">
                    Notre responsabilité est limitée au montant des frais que
                    vous avez payés au cours des 12 derniers mois.
                  </p>
                </div>

                {/* Résiliation */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserX className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        7. Résiliation du compte
                      </h2>

                      <p className="text-gray-600 mb-4">
                        Nous pouvons suspendre ou résilier votre compte à tout
                        moment si :
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Vous violez ces conditions d'utilisation</li>
                        <li>
                          Vous utilisez le service de manière frauduleuse ou
                          abusive
                        </li>
                        <li>
                          Nous devons nous conformer à une obligation légale
                        </li>
                        <li>Votre compte est inactif pendant plus de 2 ans</li>
                      </ul>
                      <p className="text-gray-600 mt-4">
                        Vous pouvez également supprimer votre compte à tout
                        moment depuis vos paramètres ou en nous contactant.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modifications */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    8. Modifications des conditions
                  </h2>

                  <p className="text-gray-600">
                    Nous nous réservons le droit de modifier ces conditions à
                    tout moment. Les modifications importantes seront notifiées
                    par email ou via une notification sur la plateforme. Votre
                    utilisation continue du service après modification constitue
                    votre acceptation des nouvelles conditions.
                  </p>
                </div>

                {/* Droit applicable */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gavel className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        9. Droit applicable et juridiction
                      </h2>

                      <p className="text-gray-600">
                        Ces conditions sont régies par le droit français. Tout
                        litige relatif à l'utilisation de mcGuyane sera soumis à
                        la compétence exclusive des tribunaux de Cayenne, Guyane
                        française.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-teal-500 rounded-2xl p-8 text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-3">
                    Questions sur les conditions ?
                  </h2>
                  <p className="text-purple-100 mb-6">
                    Pour toute question concernant ces conditions d'utilisation,
                    n'hésitez pas à nous contacter.
                  </p>
                  <div className="flex justify-center mb-6">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-full font-bold hover:bg-gray-50 transition-all duration-300"
                    >
                      Formulaire de contact
                    </a>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20 text-sm text-purple-100">
                    <p className="font-semibold mb-2">Projet développé par</p>
                    <p>
                      <a
                        href="https://github.com/preneuscliford"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white underline"
                      >
                        Preneus Cliford
                      </a>{" "}
                      - Apprenant chez Studi
                    </p>
                    <p className="mt-1">
                      <a
                        href="https://www.linkedin.com/in/preneus-cliford/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white underline"
                      >
                        LinkedIn
                      </a>
                    </p>
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
