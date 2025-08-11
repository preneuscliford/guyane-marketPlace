'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  MapPin,
  Star,
  Eye,
  Phone,
  Mail,
  Clock,
  DollarSign,
  User,
  Calendar,
  Tag,
  Share2,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import { useAutoServiceViews } from '@/hooks/useServiceViews';
import { ServiceViewsSimple } from '@/components/services/ServiceViewsDisplay';
import { ServiceReviews } from '@/components/services/ServiceReviews';
import { ServiceWithProfile } from '@/types/services';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { toast } from 'sonner';

/**
 * Page de détail d'un service
 */
export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getServiceById, deleteService, loading } = useServices();
  
  const [service, setService] = useState<ServiceWithProfile | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Utiliser le nouveau système de vues intelligent
  const { viewResult, loading: viewsLoading } = useAutoServiceViews(
    params.id as string,
    true // Activer dès que l'ID est disponible
  );

  /**
   * Gère la suppression du service
   */
  const handleDelete = async () => {
    if (!service || !window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteService(service.id);
      toast.success('Service supprimé avec succès');
      router.push('/services');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du service');
    } finally {
      setIsDeleting(false);
    }
  };

  // Charger le service
  useEffect(() => {
    const loadService = async () => {
      if (!params.id || typeof params.id !== 'string') {
        setError('ID de service invalide');
        return;
      }

      try {
        const serviceData = await getServiceById(params.id);
        if (serviceData) {
          setService(serviceData);
        } else {
          setError('Service non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du service:', err);
        setError('Erreur lors du chargement du service');
      }
    };

    loadService();
  }, [params.id, getServiceById]);

  /**
   * Formate le prix selon le type
   */
  const formatPrice = (price: number, priceType: string) => {
    if (price === 0) return 'Gratuit';
    
    const formattedPrice = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);

    switch (priceType) {
      case 'hourly':
        return `${formattedPrice}/h`;
      case 'daily':
        return `${formattedPrice}/jour`;
      case 'monthly':
        return `${formattedPrice}/mois`;
      case 'negotiable':
        return `${formattedPrice} (négociable)`;
      default:
        return formattedPrice;
    }
  };

  /**
   * Obtient la couleur du badge de disponibilité
   */
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Obtient le texte de disponibilité
   */
  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'Occupé';
      case 'unavailable':
        return 'Indisponible';
      default:
        return 'Non spécifié';
    }
  };

  /**
   * Gère le contact avec le prestataire
   */
  const handleContact = (type: 'phone' | 'email') => {
    if (!service) return;

    if (type === 'phone' && service.contact_info?.phone) {
      window.open(`tel:${service.contact_info.phone}`);
    } else if (type === 'email' && service.contact_info?.email) {
      window.open(`mailto:${service.contact_info.email}`);
    } else {
      toast.error('Information de contact non disponible');
    }
  };

  /**
   * Partage le service
   */
  const handleShare = async () => {
    if (!service) return;

    const shareData = {
      title: service.title,
      text: service.description,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier l'URL
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers!');
    }
  };

  /**
   * Navigation dans les images
   */
  const nextImage = () => {
    if (service?.images && service.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === service.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (service?.images && service.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? service.images!.length - 1 : prev - 1
      );
    }
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du service...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error || 'Service non trouvé'}</p>
            <Button onClick={() => router.push('/services')} variant="outline">
              Retour aux services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {service.images && service.images.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={service.images[currentImageIndex]}
                    alt={`${service.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-service.jpg';
                    }}
                  />
                  
                  {/* Navigation des images */}
                  {service.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      {/* Indicateurs */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {service.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Badge de disponibilité */}
                  <div className="absolute top-4 right-4">
                    <Badge className={getAvailabilityColor(service.availability as unknown as string)}>
                      <Clock className="h-3 w-3 mr-1" />
                      {getAvailabilityText(service.availability as unknown as string)}
                    </Badge>    
                  </div>
                </div>
                
                {/* Miniatures */}
                {service.images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {service.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Miniature ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informations principales */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(service.created_at), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </span>
                    </div>
                    <ServiceViewsSimple 
                      totalViews={service.total_views}
                      views={service.views}
                    />
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(service.price ?? 0, service.price_type)}
                  </div>
                  <Badge variant="secondary">{service.category}</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
                </div>
                
                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section des avis */}
          <ServiceReviews 
            serviceId={service.id}
            serviceOwnerId={service.user_id}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profil du prestataire */}
          {service.profiles && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prestataire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={service.profiles.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {service.profiles.full_name || service.profiles.username || 'Utilisateur'}
                    </h4>
                    {service.profiles.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {service.profiles.location}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Actions de contact */}
                <div className="space-y-2">
                  {service.contact_info?.phone && (
                    <Button
                      onClick={() => handleContact('phone')}
                      className="w-full"
                      variant="outline"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                  )}
                  
                  {service.contact_info?.email && (
                    <Button
                      onClick={() => handleContact('email')}
                      className="w-full"
                      variant="outline"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer un email
                    </Button>
                  )}
                  
                  {user && user.id !== service.user_id && (
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Envoyer un message
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {service.contact_info?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{service.contact_info.phone}</span>
                </div>
              )}
              
              {service.contact_info?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="break-all">{service.contact_info.email}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{service.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          {user && user.id === service.user_id && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gestion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/services/${service.id}/modifier`}>
                    Modifier le service
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer le service'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}