"use client";

import { Header } from "@/components/layout/Header";
import {
  ShoppingBag,
  Users,
  Target,
  Heart,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/20">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-fuchsia-500/10 to-teal-500/10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  À propos de mcGuyane
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
                  La marketplace locale
                </span>
                <br />
                <span className="text-gray-900">qui connecte la Guyane</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                mcGuyane est la première plateforme dédiée aux services,
                produits et annonces en Guyane française. Nous facilitons les
                échanges locaux et soutenons l'économie du territoire.
              </p>

              {/* MVP Notice */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-purple-50 via-fuchsia-50 to-teal-50 border-2 border-purple-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 mb-2">
                        🚀 Plateforme en évolution constante
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Nous développons activement mcGuyane avec de nouvelles
                        fonctionnalités ajoutées régulièrement. Votre feedback
                        nous aide à créer la meilleure expérience possible pour
                        la communauté guyanaise !
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Explorer la marketplace
                  <ShoppingBag className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-200 text-purple-700 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Notre Mission
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Créer un écosystème numérique pour dynamiser l'économie locale
                  guyanaise
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Vision
                  </h3>
                  <p className="text-gray-600">
                    Devenir la plateforme de référence pour tous les échanges
                    commerciaux et de services en Guyane française.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-fuchsia-50 to-white p-8 rounded-2xl border border-fuchsia-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-fuchsia-100 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="w-7 h-7 text-fuchsia-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Valeurs
                  </h3>
                  <p className="text-gray-600">
                    Transparence, confiance, solidarité et promotion de
                    l'économie locale sont au cœur de notre engagement.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-teal-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Communauté
                  </h3>
                  <p className="text-gray-600">
                    Construire une communauté active où chacun peut proposer,
                    découvrir et échanger en toute confiance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Pourquoi choisir mcGuyane ?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Sécurisé
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Transactions et données protégées
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Rapide
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Publiez vos annonces en quelques clics
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-fuchsia-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Performant
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Augmentez votre visibilité locale
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Local
                  </h3>
                  <p className="text-gray-600 text-sm">
                    100% dédié à la Guyane française
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-teal-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Rejoignez la communauté mcGuyane
              </h2>
              <p className="text-lg text-purple-100 mb-8">
                Des milliers d'utilisateurs font déjà confiance à mcGuyane pour
                leurs besoins quotidiens
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/auth?mode=signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-full font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Créer un compte
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full font-bold hover:bg-white/20 transition-all duration-300"
                >
                  Découvrir la marketplace
                </Link>
              </div>

              {/* Developer Info */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-white/90 font-semibold mb-3">
                  Projet développé par
                </p>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg">
                    <a
                      href="https://github.com/preneuscliford"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-purple-200 underline decoration-2 underline-offset-4"
                    >
                      Preneus Cliford
                    </a>
                  </p>
                  <p className="text-purple-100">
                    Apprenant chez Studi - Graduate Développeur Full Stack
                  </p>
                  <div className="flex gap-4 mt-2">
                    <a
                      href="https://www.linkedin.com/in/preneus-cliford/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-white underline"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/preneuscliford"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-white underline"
                    >
                      GitHub
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
