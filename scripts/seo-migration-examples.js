/**
 * Script d'exemple pour implémenter automatiquement le SEO sur les pages de détails existantes
 * 
 * Ce script montre comment modifier les pages [id] existantes pour ajouter les métadonnées SEO
 */

// ============================================================================
// SERVICES - Exemple de modification de /services/[id]/page.tsx
// ============================================================================

const servicesPageTemplate = `
import { generateServiceMetadata, ServiceJSONLD } from '@/components/seo/PublicationSEO';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// AJOUT: Fonction pour récupérer les données côté serveur
async function getServiceById(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select(\`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    \`)
    .eq('id', id)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// AJOUT: Génération des métadonnées SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const service = await getServiceById(params.id);
  
  if (!service) {
    return { 
      title: 'Service non trouvé - Guyane Marketplace',
      description: 'Ce service n\\'existe pas ou n\\'est plus disponible sur Guyane Marketplace.'
    };
  }

  return generateServiceMetadata({
    id: service.id,
    title: service.title,
    description: service.description,
    category: service.category,
    location: service.location,
    price: service.price_min || service.price,
    author: service.profiles?.username,
    rating: service.average_rating,
    reviewCount: service.review_count,
    viewCount: service.view_count,
    createdAt: service.created_at,
    updatedAt: service.updated_at,
    images: service.images,
  });
}

// Page principale (code existant + ajout JSON-LD)
export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  // ... code existant pour récupérer et afficher le service ...
  
  return (
    <>
      {/* AJOUT: Injection des données structurées JSON-LD */}
      {service && (
        <ServiceJSONLD service={{
          id: service.id,
          title: service.title,
          description: service.description,
          category: service.category,
          location: service.location,
          price: service.price_min || service.price,
          author: service.profiles?.username,
          rating: service.average_rating,
          reviewCount: service.review_count,
          viewCount: service.view_count,
          createdAt: service.created_at,
          updatedAt: service.updated_at,
          images: service.images,
        }} />
      )}
      
      {/* Code existant de la page */}
      <div className="container mx-auto px-4 py-8">
        {/* ... contenu existant ... */}
      </div>
    </>
  );
}
`;

// ============================================================================
// ANNONCES - Exemple de modification de /annonces/[id]/page.tsx  
// ============================================================================

const annoncesPageTemplate = `
import { generateAnnouncementMetadata, AnnouncementJSONLD } from '@/components/seo/PublicationSEO';

// AJOUT: Fonction pour récupérer les données côté serveur
async function getAnnouncementById(id: string) {
  const { data, error } = await supabase
    .from('announcements')
    .select(\`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    \`)
    .eq('id', id)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// AJOUT: Métadonnées SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const announcement = await getAnnouncementById(params.id);
  
  if (!announcement) {
    return { 
      title: 'Annonce non trouvée - Petites Annonces Guyane',
      description: 'Cette annonce n\\'existe pas ou n\\'est plus disponible.'
    };
  }

  return generateAnnouncementMetadata({
    id: announcement.id,
    title: announcement.title,
    description: announcement.description,
    category: announcement.category,
    location: announcement.location,
    price: announcement.price,
    author: announcement.profiles?.username,
    viewCount: announcement.view_count,
    createdAt: announcement.created_at,
    updatedAt: announcement.updated_at,
    images: announcement.images,
  });
}

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  // ... code existant ...

  return (
    <>
      {/* AJOUT: JSON-LD pour les annonces */}
      {announcement && (
        <AnnouncementJSONLD announcement={{
          id: announcement.id,
          title: announcement.title,
          description: announcement.description,
          category: announcement.category,
          location: announcement.location,
          price: announcement.price,
          author: announcement.profiles?.username,
          viewCount: announcement.view_count,
          createdAt: announcement.created_at,
          updatedAt: announcement.updated_at,
          images: announcement.images,
        }} />
      )}
      
      {/* Code existant */}
      <div>
        {/* ... contenu existant ... */}
      </div>
    </>
  );
}
`;

// ============================================================================
// COMMUNAUTÉ - Création de /communaute/[id]/page.tsx (si n'existe pas)
// ============================================================================

const communityPageTemplate = `
import { generateCommunityPostMetadata, CommunityPostJSONLD } from '@/components/seo/CommunityPostSEO';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// Fonction pour récupérer un post communautaire
async function getCommunityPostById(id: string) {
  const { data, error } = await supabase
    .from('community_posts')
    .select(\`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    \`)
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// Métadonnées SEO communautaires
export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getCommunityPostById(params.id);
  
  if (!post) {
    return { 
      title: 'Discussion non trouvée - Communauté Guyane',
      description: 'Cette discussion n\\'existe pas ou a été supprimée.'
    };
  }

  return generateCommunityPostMetadata({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    location: post.location,
    author: post.profiles?.username,
    viewCount: post.view_count,
    replyCount: post.reply_count,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    isQuestion: post.type === 'question',
    tags: post.tags,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
  });
}

export default function CommunityPostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    const postData = await getCommunityPostById(params.id);
    if (!postData) {
      notFound();
    }
    setPost(postData);
    setLoading(false);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      {/* JSON-LD pour la communauté */}
      <CommunityPostJSONLD post={{
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        location: post.location,
        author: post.profiles?.username,
        viewCount: post.view_count,
        replyCount: post.reply_count,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        isQuestion: post.type === 'question',
        tags: post.tags,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
      }} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête du post */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {post.type === 'question' ? '❓' : '💬'}
                <span className="text-sm text-gray-500">
                  {post.type === 'question' ? 'Question' : 'Discussion'}
                </span>
                {post.category && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {post.category}
                  </span>
                )}
                {post.location && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    📍 {post.location}
                  </span>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            
            <div className="prose max-w-none">
              {post.content.split('\\n').map((paragraph, index) => (
                <p key={index} className="mb-3">{paragraph}</p>
              ))}
            </div>
            
            {/* Métadonnées d'engagement */}
            <div className="flex items-center space-x-6 mt-6 pt-4 border-t text-sm text-gray-500">
              <span>👁️ {post.view_count || 0} vues</span>
              <span>💬 {post.reply_count || 0} réponses</span>
              {post.upvotes && (
                <span>👍 {post.upvotes - (post.downvotes || 0)} points</span>
              )}
              <span>📅 {new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          
          {/* Section des réponses/commentaires */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {post.type === 'question' ? 'Réponses' : 'Commentaires'}
            </h2>
            {/* Implémenter le système de réponses ici */}
          </div>
        </div>
      </div>
    </>
  );
}
`;

// ============================================================================
// INSTRUCTIONS DE MIGRATION
// ============================================================================

const migrationInstructions = \`
# 🚀 Instructions de Migration SEO

## 1. Préparation
\\\`\\\`\\\`bash
# Sauvegarder les fichiers existants
cp app/services/[id]/page.tsx app/services/[id]/page.tsx.backup
cp app/annonces/[id]/page.tsx app/annonces/[id]/page.tsx.backup
cp app/marketplace/[id]/page.tsx app/marketplace/[id]/page.tsx.backup
\\\`\\\`\\\`

## 2. Modification des pages existantes

### Services
1. Ajouter l'import des composants SEO en haut du fichier
2. Ajouter la fonction \\\`generateMetadata()\\\` 
3. Ajouter le composant \\\`<ServiceJSONLD>\\\` dans le JSX

### Annonces  
1. Même processus avec les composants annonces
2. Vérifier que les champs de données correspondent

### Marketplace
1. Utiliser les composants produits
2. Adapter selon la structure des données

### Communauté
1. Créer le fichier \\\`app/communaute/[id]/page.tsx\\\` s'il n'existe pas
2. Implémenter la structure Q&A/Discussion

## 3. Tests
\\\`\\\`\\\`bash
# Tester le build
npm run build

# Tester localement
npm run dev

# Vérifier les métadonnées
curl -I http://localhost:3000/services/[id]
\\\`\\\`\\\`

## 4. Validation SEO
- Rich Snippets: https://search.google.com/test/rich-results
- Open Graph: https://developers.facebook.com/tools/debug/
- Structured Data: https://validator.schema.org/

## 5. Déploiement
\\\`\\\`\\\`bash
# Déployer sur production
git add .
git commit -m "feat: ajout SEO avancé pour publications individuelles"
git push origin main
\\\`\\\`\\\`
\`;

export {
  servicesPageTemplate,
  annoncesPageTemplate,
  communityPageTemplate,
  migrationInstructions
};
`;

export default migrationScript;