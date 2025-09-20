'use client';

import React from 'react';
import { ServiceForm } from '@/components/services/ServiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRequireAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

/**
 * Page de création d'un nouveau service
 */
export default function NewServicePage() {
  const { user, loading } = useRequireAuth();
  const router = useRouter();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Ne pas afficher la page si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux services
          </Link>
        </Button>
      </div>

      {/* En-tête */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Plus className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Proposer un service</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Partagez vos compétences et services avec la communauté. 
          Remplissez le formulaire ci-dessous pour créer votre annonce de service.
        </p>
      </div>

      {/* Conseils */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-lg">
            💡 Conseils pour une annonce réussie
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li>• <strong>Titre clair :</strong> Décrivez précisément votre service</li>
            <li>• <strong>Description détaillée :</strong> Expliquez ce que vous proposez, votre expérience</li>
            <li>• <strong>Prix transparent :</strong> Indiquez vos tarifs clairement</li>
            <li>• <strong>Photos de qualité :</strong> Ajoutez des images de vos réalisations</li>
            <li>• <strong>Contact facile :</strong> Renseignez vos coordonnées</li>
            <li>• <strong>Localisation précise :</strong> Indiquez votre zone d'intervention</li>
          </ul>
        </CardContent>
      </Card>

      {/* Formulaire */}
      <ServiceForm
        onSuccess={() => {
          router.push('/services?created=true');
        }}
        onCancel={() => {
          router.push('/services');
        }}
      />

      {/* Informations légales */}
      <Card className="mt-8 bg-gray-50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">📋 Informations importantes</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              • En publiant votre service, vous acceptez nos conditions d'utilisation
            </p>
            <p>
              • Votre annonce sera visible publiquement après validation
            </p>
            <p>
              • Vous pouvez modifier ou supprimer votre annonce à tout moment
            </p>
            <p>
              • Les transactions se font directement entre vous et vos clients
            </p>
            <p>
              • Nous nous réservons le droit de modérer les contenus inappropriés
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
