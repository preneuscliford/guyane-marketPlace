"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Share2, MapPin, Calendar, Eye, MessageCircle, Edit, Trash2, Star, TrendingUp, Phone, Mail, Globe, Clock, Shield, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MessageModal from "../../../components/messaging/MessageModal";
import ReportButton from "@/components/ui/ReportButton";

/**
 * Page de détails d'une annonce
 * Affiche toutes les informations d'une annonce avec possibilité d'interaction
 */
export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
    incrementViewCount();
  }, [id]);

  /**
   * Récupère les détails de l'annonce depuis Supabase
   */
  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setAnnouncement(data);
      setViewCount(data.view_count || 0);
      setImpressions(data.impressions || 0);
      setClicks(data.clicks || 0);
      
      // Vérifier si l'utilisateur a liké cette annonce
      if (user) {
        const { data: likeData } = await supabase
          .from('announcement_likes')
          .select('*')
          .eq('announcement_id', id)
          .eq('user_id', user.id)
          .single();
        
        setIsLiked(!!likeData);
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Incrémente le compteur de vues de l'annonce
   */
  const incrementViewCount = async () => {
    try {
      await supabase.rpc('increment_announcement_views', {
        announcement_id: id
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  /**
   * Incrémente le compteur de clics de l'annonce
   */
  const incrementClickCount = async () => {
    try {
      await supabase.rpc('increment_announcement_clicks', {
        announcement_id: id
      });
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  };

  /**
   * Gère l'ajout/suppression des likes
   */
  const handleLike = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('announcement_likes')
          .delete()
          .eq('announcement_id', id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('announcement_likes')
          .insert({ announcement_id: id, user_id: user.id });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  /**
   * Gère le partage de l'annonce
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: announcement.title,
          text: announcement.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  /**
   * Supprime l'annonce (seulement pour le propriétaire)
   */
  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      router.push('/annonces');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Erreur lors de la suppression de l\'annonce');
    }
  };

  /**
   * Gère le clic sur le bouton d'action principal
   */
  const handleMainAction = async () => {
    await incrementClickCount();
    // Rediriger vers l'URL de l'annonce ou ouvrir une modal de contact
    if (announcement.url) {
      window.open(announcement.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Annonce non trouvée</h1>
          <p className="text-gray-600 mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
          <Button asChild>
            <Link href="/annonces">Retour aux annonces</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === announcement.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/annonces" className="hover:text-purple-600 transition-colors">
              Annonces
            </Link>
            <span>/</span>
            <span className="text-gray-900">{announcement.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Galerie d'images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="aspect-square relative overflow-hidden rounded-2xl shadow-2xl bg-white">
              <Image
                src={announcement.images?.[currentImage] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center"}
                alt={announcement.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              
              {/* Badge de statut */}
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  ✨ Sponsorisé
                </span>
              </div>
              
              {/* Statistiques */}
              <div className="absolute top-4 right-4 space-y-2">
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {viewCount}
                </div>
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {impressions}
                </div>
              </div>
            </div>
            
            {announcement.images && announcement.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {announcement.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-20 h-20 relative rounded-xl overflow-hidden transition-all duration-200 ${
                      currentImage === index 
                        ? 'ring-4 ring-purple-500 scale-105' 
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${announcement.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Détails de l'annonce */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* En-tête */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{announcement.title}</h1>
                  <div className="flex items-center space-x-4">
                    {announcement.budget && (
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Budget: {formatPrice(announcement.budget)}
                      </p>
                    )}
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Actif
                    </div>
                  </div>
                </div>
                
                {/* Actions du propriétaire */}
                {isOwner && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/annonces/${id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-purple-500" />
                  {announcement.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                  {formatDate(announcement.created_at)}
                </div>
              </div>
            </div>

            {/* Statistiques de performance */}
            {isOwner && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">📊 Performances</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{impressions}</div>
                    <div className="text-sm text-gray-600">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{clicks}</div>
                    <div className="text-sm text-gray-600">Clics</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">CTR</div>
                  </div>
                </div>
              </div>
            )}

            {/* Catégorie */}
            {announcement.category && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm font-medium rounded-full">
                  {announcement.category}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{announcement.description}</p>
            </div>

            {/* Boutons d'action */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 gap-3 mb-4">
                <Button 
                  onClick={handleMainAction}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  🚀 Voir l'offre maintenant
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsMessageModalOpen(true)}
                  className="border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 font-medium py-4 text-lg transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contacter l'annonceur
                </Button>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleLike}
                  className={`flex-1 transition-all duration-200 ${
                    isLiked 
                      ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100' 
                      : 'hover:border-red-200 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Aimé' : 'J\'aime'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 hover:border-blue-200 hover:text-blue-500 transition-all duration-200"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
                <ReportButton
                  contentType="announcement"
                  contentId={announcement.id}
                  reportedUserId={announcement.user_id}
                  variant="outline"
                  size="md"
                  className="hover:border-red-200 hover:text-red-500 transition-all duration-200"
                  showText={false}
                />
              </div>
            </div>

            {/* Informations annonceur */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Informations du créateur
              </h3>
              
              {/* Profil principal */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400 flex-shrink-0 ring-4 ring-purple-100">
                  {announcement.profiles?.avatar_url ? (
                    <Image
                      src={announcement.profiles.avatar_url}
                      alt={announcement.profiles.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      {announcement.profiles?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-bold text-xl text-gray-900">{announcement.profiles?.username}</h4>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Vérifié
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                    Membre depuis {formatDate(announcement.profiles?.created_at)}
                  </p>
                  
                  {/* Évaluation */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">4.9/5</span>
                      <span className="text-xs text-gray-500 ml-1">(127 avis)</span>
                    </div>
                  </div>
                  
                  {/* Badges de confiance */}
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      Vendeur Pro
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Réponse rapide
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Statistiques du vendeur */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">47</div>
                  <div className="text-xs text-gray-600">Annonces</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-xs text-gray-600">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2h</div>
                  <div className="text-xs text-gray-600">Temps réponse</div>
                </div>
              </div>
              
              {/* Informations de contact */}
              <div className="space-y-3 mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Moyens de contact</h5>
                
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">Messagerie interne</p>
                      <p className="text-xs text-green-600">Recommandé - Sécurisé et traçable</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setIsMessageModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Contacter
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">Téléphone</p>
                      <p className="text-xs text-blue-600">Disponible après premier contact</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Révéler
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Mail className="w-5 h-5 text-purple-600 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-800">Email</p>
                      <p className="text-xs text-purple-600">Contact direct disponible</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Révéler
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Localisation */}
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Localisation</h5>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{announcement.location}</p>
                    <p className="text-xs text-gray-600">Guyane Française</p>
                  </div>
                </div>
              </div>
              
              {/* Horaires de disponibilité */}
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Disponibilité</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Lun - Ven</span>
                    <span className="font-medium text-gray-800">8h - 18h</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Sam - Dim</span>
                    <span className="font-medium text-gray-800">9h - 16h</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1 hover:border-purple-200 hover:text-purple-600"
                  asChild
                >
                  <Link href={`/profile/${announcement.user_id}`}>
                    Voir le profil complet
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:border-blue-200 hover:text-blue-600"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Suivre
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal de messagerie */}
      {announcement && (        
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          receiverId={announcement.user_id}
          receiverName={announcement.profiles?.username || 'Annonceur'}
          productTitle={announcement.title}
        />
      )}
    </div>
  );
}