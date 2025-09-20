"use client";

/**
 * Exemples d'utilisation et guide de migration vers TanStack Query
 * Ce fichier démontre comment utiliser les nouveaux hooks optimisés
 */

import React from "react";
import {
  useServicesQuery,
  useCreateServiceMutation,
  useUserServicesQuery,
} from "./useServices.query";
import {
  useAdvertisementsQuery,
  useActiveAdvertisementsForCarousel,
  useCreateAdvertisementMutation,
} from "./useAdvertisements.query";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
  useIsFavoriteQuery,
} from "./useFavorites.query";
import { useReviewsQuery, useCreateReviewMutation } from "./useReviews.query";
import {
  useServiceViewStatsQuery,
  useAutoIncrementViews,
} from "./useServiceViews.query";
import { quickConfigs } from "./cacheConfig";

/**
 * Exemple 1: Services avec cache optimisé
 */
export function ServicesExample() {
  // ✅ Nouveau: Cache intelligent selon la page
  const {
    data: services,
    isLoading,
    error,
  } = useServicesQuery(
    { category: "technology", limit: 10 },
    quickConfigs.servicesList
  );

  // ✅ Nouveau: Création avec invalidation automatique
  const createServiceMutation = useCreateServiceMutation();

  // ✅ Nouveau: Services utilisateur avec cache optimisé
  const { data: userServices } = useUserServicesQuery(
    quickConfigs.userServices
  );

  const handleCreateService = async () => {
    try {
      await createServiceMutation.mutateAsync({
        title: "Nouveau Service",
        description: "Description du service",
        category: "technology",
        price: 100,
        location: "Paris",
        price_type: "fixed",
      });
      console.log(
        "✅ Service créé avec succès! Cache automatiquement invalidé."
      );
    } catch (error) {
      console.error("❌ Erreur lors de la création:", error);
    }
  };

  if (isLoading) return <div>Chargement des services...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      <h2>Services (Cache: {quickConfigs.servicesList.staleTime}ms)</h2>
      <button
        onClick={handleCreateService}
        disabled={createServiceMutation.isPending}
      >
        {createServiceMutation.isPending ? "Création..." : "Créer un service"}
      </button>
      <div>
        {services?.map((service) => (
          <div key={service.id}>
            <h3>{service.title}</h3>
            <p>
              Note: {service.rating}/5 ({service.reviews_count} avis)
            </p>
          </div>
        ))}
      </div>

      <h3>Mes Services ({userServices?.length || 0})</h3>
      {userServices?.map((service) => (
        <div key={service.id}>{service.title}</div>
      ))}
    </div>
  );
}

/**
 * Exemple 2: Favoris avec optimistic updates
 */
export function FavoritesExample({
  announcementId,
}: {
  announcementId: string;
}) {
  // ✅ Nouveau: Vérification avec cache
  const { data: isFavorite, isLoading } = useIsFavoriteQuery(
    announcementId,
    quickConfigs.favoriteCheck
  );

  // ✅ Nouveau: Toggle avec optimistic update
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  // ✅ Nouveau: Liste des favoris avec cache
  const { data: favorites } = useFavoritesQuery(quickConfigs.userFavorites);

  const handleToggleFavorite = async () => {
    try {
      // L'UI se met à jour immédiatement (optimistic update)
      await toggleFavoriteMutation.mutateAsync(announcementId);
      console.log("✅ Favori togglé avec optimistic update!");
    } catch (error) {
      console.error("❌ Erreur (rollback automatique):", error);
    }
  };

  return (
    <div>
      <h2>Favoris</h2>
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading || toggleFavoriteMutation.isPending}
      >
        {isFavorite ? "❤️ Retirer des favoris" : "🤍 Ajouter aux favoris"}
      </button>

      <h3>Mes Favoris ({favorites?.length || 0})</h3>
      {favorites?.map((favoriteId) => (
        <div key={favoriteId}>Favori: {favoriteId}</div>
      ))}
    </div>
  );
}

/**
 * Exemple 3: Vues avec analytics en temps réel
 */
export function ServiceViewsExample({ serviceId }: { serviceId: string }) {
  // ✅ Nouveau: Auto-incrémentation avec cache intelligent
  const { viewResult, loading } = useAutoIncrementViews(serviceId, true);

  // ✅ Nouveau: Stats avec cache optimisé
  const { data: viewStats, isLoading: statsLoading } = useServiceViewStatsQuery(
    serviceId,
    quickConfigs.viewStats
  );

  return (
    <div>
      <h2>Analytics de Vues</h2>

      {loading && <p>📈 Enregistrement de la vue...</p>}
      {viewResult && (
        <p>
          {viewResult.success ? "✅" : "❌"}
          {viewResult.is_new_unique_view
            ? "Nouvelle vue unique!"
            : "Vue déjà comptée"}
        </p>
      )}

      {statsLoading ? (
        <p>Chargement des stats...</p>
      ) : viewStats ? (
        <div>
          <p>Vues totales: {viewStats.total_views}</p>
          <p>Vues uniques: {viewStats.unique_views}</p>
          <p>Vues aujourd'hui: {viewStats.views_today}</p>
          <p>Vues cette semaine: {viewStats.views_this_week}</p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Exemple 4: Reviews avec cache optimisé
 */
export function ReviewsExample({ serviceId }: { serviceId: string }) {
  // ✅ Nouveau: Reviews avec cache
  const { data: reviews, isLoading } = useReviewsQuery(
    { serviceId },
    quickConfigs.serviceReviews
  );

  // ✅ Nouveau: Création avec invalidation
  const createReviewMutation = useCreateReviewMutation();

  const handleAddReview = async () => {
    try {
      await createReviewMutation.mutateAsync({
        targetUserId: "target-user-id",
        serviceId,
        rating: 5,
        comment: "Excellent service!",
      });
      console.log(
        "✅ Avis ajouté avec succès! Cache automatiquement invalidé."
      );
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de l'avis:", error);
    }
  };

  if (isLoading) return <div>Chargement des avis...</div>;

  return (
    <div>
      <h2>Avis</h2>
      <button
        onClick={handleAddReview}
        disabled={createReviewMutation.isPending}
      >
        {createReviewMutation.isPending ? "Ajout..." : "Ajouter un avis"}
      </button>

      <div>
        {reviews?.map((review) => (
          <div key={review.id}>
            <strong>{review.profiles?.username}</strong>
            <span> - {review.rating}/5 étoiles</span>
            {review.comment && <p>{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Exemple 5: Publicités avec carousel optimisé
 */
export function AdvertisementsExample() {
  // ✅ Nouveau: Publicités actives pour le carousel
  const {
    advertisements: activeAds,
    loading: adsLoading,
    refetch: refetchAds,
  } = useActiveAdvertisementsForCarousel();

  // ✅ Nouveau: Toutes les publicités avec pagination
  const { data: allAds } = useAdvertisementsQuery(
    { page: 1, limit: 5, filters: { status: ["active"] } },
    quickConfigs.advertisementsList
  );

  return (
    <div>
      <h2>Publicités</h2>

      <h3>Carousel ({activeAds.length} publicités actives)</h3>
      {adsLoading ? (
        <p>Chargement du carousel...</p>
      ) : (
        <div style={{ display: "flex", gap: "10px", overflow: "auto" }}>
          {activeAds.map((ad) => (
            <div
              key={ad.id}
              style={{
                minWidth: "200px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <h4>{ad.title}</h4>
              <p>Budget: €{ad.budget}</p>
              {ad.image_url && (
                <img
                  src={ad.image_url}
                  alt={ad.title}
                  style={{ width: "100%", height: "100px", objectFit: "cover" }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={() => refetchAds()}>🔄 Actualiser le carousel</button>

      <h3>Toutes les publicités ({allAds?.total || 0})</h3>
      {allAds?.data.map((ad) => (
        <div key={ad.id}>
          <strong>{ad.title}</strong> - €{ad.budget}
        </div>
      ))}
    </div>
  );
}

/**
 * Guide de migration - Comparaison avant/après
 */
export const MigrationGuide = {
  // ❌ Ancien pattern (useState + useEffect)
  oldPattern: `
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      async function fetchServices() {
        setLoading(true);
        try {
          const { data } = await supabase.from('services').select('*');
          setServices(data || []);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
      fetchServices();
    }, []);
  `,

  // ✅ Nouveau pattern (TanStack Query)
  newPattern: `
    const { data: services, isLoading } = useServicesQuery(
      { category: 'tech' },
      quickConfigs.servicesList
    );
    
    // Cache automatique, refetch intelligent, pas de code boilerplate!
  `,

  advantages: [
    "🚀 Cache automatique avec invalidation intelligente",
    "⚡ Optimistic updates pour les favoris et reviews",
    "🔄 Background refetch et synchronisation automatique",
    "📊 Devtools intégrés pour debugging",
    "🎯 Configuration fine par type de données",
    "♻️ Réduction drastique du code boilerplate",
    "🛡️ Gestion d'erreur et retry automatiques",
    "📱 Support offline et resynchronisation",
  ],
};

/**
 * Métriques de performance attendues
 */
export const PerformanceMetrics = {
  cacheHitRatio: "> 70%", // Taux de cache hits attendu
  apiCallReduction: "~50%", // Réduction des appels API
  renderOptimization: "~30%", // Réduction des re-renders inutiles
  loadingStates: "Instantané pour données cached",
  userExperience: "Optimistic updates pour interactions critiques",

  // Outils pour mesurer
  tools: [
    "React DevTools Profiler",
    "TanStack Query DevTools",
    "Network tab pour compter les requêtes",
    "Performance tab pour mesurer les re-renders",
  ],
};

/**
 * Composant de test de performance (utilise tous les hooks)
 */
export function PerformanceTestComponent() {
  const serviceId = "test-service-id";
  const announcementId = "test-announcement-id";

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 Demo TanStack Query - Performance Optimisée</h1>

      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        }}
      >
        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <ServicesExample />
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <FavoritesExample announcementId={announcementId} />
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <ServiceViewsExample serviceId={serviceId} />
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <ReviewsExample serviceId={serviceId} />
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            gridColumn: "1 / -1",
          }}
        >
          <AdvertisementsExample />
        </div>
      </div>

      <div
        style={{ marginTop: "20px", padding: "15px", background: "#f5f5f5" }}
      >
        <h2>📈 Avantages de Performance</h2>
        <ul>
          {MigrationGuide.advantages.map((advantage, index) => (
            <li key={index}>{advantage}</li>
          ))}
        </ul>

        <h3>🎯 Métriques Cibles</h3>
        <pre style={{ background: "white", padding: "10px" }}>
          {JSON.stringify(PerformanceMetrics, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default PerformanceTestComponent;
