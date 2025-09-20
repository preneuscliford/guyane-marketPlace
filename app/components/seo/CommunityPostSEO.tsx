import { Metadata } from "next";
import { generateCommunityPostSEO, generateJSONLD } from "@/lib/seo";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category?: string;
  location?: string;
  author?: string;
  viewCount?: number;
  replyCount?: number;
  createdAt?: string;
  updatedAt?: string;
  isQuestion?: boolean;
  tags?: string[];
  upvotes?: number;
  downvotes?: number;
}

/**
 * Génère les métadonnées SEO pour un post communautaire
 * Optimisé pour apparaître dans Google comme Reddit
 */
export function generateCommunityPostMetadata(post: CommunityPost): Metadata {
  // Génération du SEO spécialisé pour la communauté
  const metadata = generateCommunityPostSEO(post);

  // Ajout de métadonnées spécifiques aux forums/communautés
  const enhancedMetadata: Metadata = {
    ...metadata,

    // Métadonnées spécifiques aux discussions/Q&A
    other: {
      ...metadata.other,

      // Signaler à Google que c'est du contenu communautaire
      "article:section": post.isQuestion
        ? "Questions & Réponses"
        : "Discussions",
      "article:tag": post.tags?.join(","),
      "article:published_time": post.createdAt,
      "article:modified_time": post.updatedAt,
      "article:author": post.author,

      // Métriques d'engagement pour Google
      "og:engagement": post.viewCount?.toString(),
      "og:replies": post.replyCount?.toString(),

      // Classification du contenu
      "content:type": post.isQuestion ? "question" : "discussion",
      "content:category": post.category,
      "content:location": post.location,

      // Signaux de qualité pour Google
      "content:score":
        post.upvotes && post.downvotes
          ? (post.upvotes - post.downvotes).toString()
          : post.upvotes?.toString(),
    },

    // OpenGraph optimisé pour le partage social
    openGraph: {
      ...metadata.openGraph,
      type: "article",

      // Métadonnées d'article pour les discussions
      article: {
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: post.author ? [post.author] : undefined,
        section: post.isQuestion ? "Questions & Réponses" : "Discussions",
        tags: post.tags,
      },

      // Optimisation pour le partage
      title: post.isQuestion
        ? `❓ ${post.title} - Question Guyane`
        : `💬 ${post.title} - Discussion Guyane`,

      description: post.isQuestion
        ? `Question posée par ${
            post.author || "un membre"
          } de la communauté Guyane. ${post.content.substring(0, 120)}... • ${
            post.replyCount || 0
          } réponses • ${post.viewCount || 0} vues`
        : `Discussion lancée par ${
            post.author || "un membre"
          } de la communauté Guyane. ${post.content.substring(0, 120)}... • ${
            post.replyCount || 0
          } commentaires • ${post.viewCount || 0} vues`,
    },

    // Twitter optimisé pour l'engagement
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image",
      title: post.isQuestion ? `❓ ${post.title}` : `💬 ${post.title}`,
      description: `${post.content.substring(
        0,
        150
      )}... | Communauté Guyane Marketplace`,
    },

    // Robots optimisé pour l'indexation communautaire
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
        // Permettre à Google de crawler les discussions
        noimageindex: false,
      },
    },
  };

  return enhancedMetadata;
}

/**
 * Génère les données structurées JSON-LD pour un post communautaire
 */
export function generateCommunityPostJSONLD(post: CommunityPost) {
  if (post.isQuestion) {
    // Structure Q&A pour les questions
    return generateJSONLD({
      type: "QAPage",
      title: post.title,
      description: post.content,
      author: post.author,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      location: post.location as any,
      viewCount: post.viewCount,
      reviewCount: post.replyCount,
      keywords: post.tags?.join(", "),
    });
  } else {
    // Structure Discussion Forum pour les discussions
    return generateJSONLD({
      type: "DiscussionForumPosting",
      title: post.title,
      description: post.content,
      author: post.author,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      location: post.location as any,
      viewCount: post.viewCount,
      keywords: post.tags?.join(", "),
    });
  }
}

/**
 * Composant qui injecte les métadonnées JSON-LD dans le head
 */
export function CommunityPostJSONLD({ post }: { post: CommunityPost }) {
  const jsonLD = generateCommunityPostJSONLD(post);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
    />
  );
}

/**
 * Génère le breadcrumb pour les posts communautaires
 */
export function generateCommunityBreadcrumbs(post: CommunityPost) {
  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Communauté", url: "/communaute" },
  ];

  if (post.category) {
    breadcrumbs.push({
      name: post.category,
      url: `/communaute?category=${encodeURIComponent(post.category)}`,
    });
  }

  if (post.location) {
    breadcrumbs.push({
      name: post.location,
      url: `/communaute?location=${encodeURIComponent(post.location)}`,
    });
  }

  breadcrumbs.push({
    name:
      post.title.length > 50 ? `${post.title.substring(0, 47)}...` : post.title,
    url: `/communaute/${post.id}`,
  });

  return generateJSONLD({
    type: "BreadcrumbList",
    breadcrumbs,
    title: "",
    description: "",
  });
}
