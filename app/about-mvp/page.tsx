import { Header } from "@/components/layout/Header";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Info,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AboutMVPPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Retour */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          {/* Titre principal */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Qu'est-ce qu'un MVP ?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez pourquoi mcGuyane est actuellement en version MVP et ce
              que cela signifie pour vous
            </p>
          </div>

          {/* Définition MVP */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  MVP : Minimum Viable Product
                </h2>
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  Un <strong>MVP (Produit Minimum Viable)</strong> est une
                  version simplifiée d'un produit qui contient uniquement les
                  fonctionnalités essentielles nécessaires pour tester le
                  concept auprès des utilisateurs réels.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  C'est une approche de développement qui permet de lancer
                  rapidement un produit, d'obtenir des retours utilisateurs, et
                  d'améliorer progressivement les fonctionnalités.
                </p>
              </div>
            </div>
          </div>

          {/* Objectifs du MVP */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Pourquoi un MVP pour mcGuyane ?
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Tester le marché
                  </h3>
                  <p className="text-gray-600">
                    Vérifier s'il y a une demande pour une marketplace locale en
                    Guyane
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Collecter les retours
                  </h3>
                  <p className="text-gray-600">
                    Comprendre les besoins réels des utilisateurs guyanais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Amélioration continue
                  </h3>
                  <p className="text-gray-600">
                    Développer les fonctionnalités les plus demandées en
                    priorité
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Lancement rapide
                  </h3>
                  <p className="text-gray-600">
                    Offrir un service utile dès maintenant plutôt que d'attendre
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fonctionnalités actuelles vs futures */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Fonctionnalités disponibles */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Disponible maintenant
                </h3>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-700">
                    Navigation et découverte
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-700">Création de compte</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-700">Interface responsive</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-700">Design moderne</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-700">SEO optimisé</span>
                </li>
              </ul>
            </div>

            {/* Fonctionnalités à venir */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-full">
                  <XCircle className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  En développement
                </h3>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <XCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">Publication d'annonces</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">Système de messagerie</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">Paiements intégrés</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">Système de notation</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">Géolocalisation avancée</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Appel à contribution */}
          <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Votre avis compte !</h2>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
              En tant qu'utilisateur de notre MVP, votre feedback est essentiel
              pour façonner l'avenir de mcGuyane. Partagez-nous vos idées et
              suggestions !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Nous contacter
              </Link>
              <Link
                href="/marketplace"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Explorer le MVP
              </Link>
            </div>
          </div>

          {/* Note de transparence */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Transparence totale</p>
                <p>
                  Nous croyons en la transparence. Ce bandeau sera retiré une
                  fois que mcGuyane aura évolué vers une version plus complète
                  avec toutes les fonctionnalités principales opérationnelles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
