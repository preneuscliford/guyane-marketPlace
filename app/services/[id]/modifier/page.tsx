"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { ServiceForm } from "@/components/services/ServiceForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/types/services";

/**
 * Page de modification d'un service existant
 * Permet au propriétaire du service de modifier ses informations
 */
export default function ModifierServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getService, loading } = useServices();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger le service à modifier
  useEffect(() => {
    const loadService = async () => {
      if (!id || typeof id !== 'string') {
        setError("ID de service invalide");
        return;
      }

      try {
        const serviceData = await getService(id);
        if (!serviceData) {
          setError("Service non trouvé");
          return;
        }

        // Vérifier que l'utilisateur est le propriétaire du service
        if (user && serviceData.user_id !== user.id) {
          setError("Vous n'êtes pas autorisé à modifier ce service");
          return;
        }

        setService(serviceData);
      } catch (err) {
        console.error('Erreur lors du chargement du service:', err);
        setError("Erreur lors du chargement du service");
      }
    };

    if (!authLoading && user) {
      loadService();
    }
  }, [id, user, authLoading, getService]);

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?redirect=/services');
    }
  }, [user, authLoading, router]);

  // Gérer la soumission réussie
  const handleSuccess = () => {
    router.push(`/services/${id}`);
  };

  // Affichage du chargement
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/services">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du formulaire de modification
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/services/${id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier le service</h1>
            <p className="text-gray-600 mt-2">
              Modifiez les informations de votre service pour attirer plus de clients.
            </p>
          </div>

          {/* Formulaire */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {service && (
                <ServiceForm
                  initialData={service}
                  onSuccess={handleSuccess}
                  mode="edit"
                />
              )}
            </div>

            {/* Conseils */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💡 Conseils pour optimiser votre service
                </h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Titre accrocheur</h4>
                    <p>Utilisez des mots-clés que vos clients recherchent.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Description détaillée</h4>
                    <p>Expliquez clairement ce que vous proposez et vos avantages.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Photos de qualité</h4>
                    <p>Ajoutez des images professionnelles de vos réalisations.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Prix transparent</h4>
                    <p>Indiquez vos tarifs pour rassurer vos clients.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Localisation précise</h4>
                    <p>Aidez vos clients à vous trouver facilement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}