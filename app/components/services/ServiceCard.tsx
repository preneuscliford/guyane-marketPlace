'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MapPin,
  Star,
  Eye,
  Phone,
  Mail,
  Clock,
  DollarSign,
  User
} from 'lucide-react';
import { ServiceViewsSimple } from './ServiceViewsDisplay';
import { ServiceWithProfile } from '@/types/services';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ServiceCardProps {
  service: ServiceWithProfile;
  showActions?: boolean;
  onEdit?: (service: ServiceWithProfile) => void;
  onDelete?: (service: ServiceWithProfile) => void;
  onContact?: (service: ServiceWithProfile) => void;
}

/**
 * Composant de carte pour afficher un service
 */
export function ServiceCard({
  service,
  showActions = false,
  onEdit,
  onDelete,
  onContact
}: ServiceCardProps) {
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

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-md hover:scale-[1.02] rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        {/* Image principale */}
        {service.images && service.images.length > 0 && (
          <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
            <img
              src={service.images[0]}
              alt={service.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-service.jpg';
              }}
            />
            {/* Badge de disponibilité */}
            <div className="absolute top-3 right-3">
              <Badge className={`${getAvailabilityColor(service.availability)} shadow-md border border-white/20`}>
                <Clock className="h-3 w-3 mr-1" />
                {getAvailabilityText(service.availability)}
              </Badge>
            </div>
          </div>
        )}

        {/* Titre et catégorie */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">
              <Link 
                href={`/services/${service.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {service.title}
              </Link>
            </h3>
          </div>
          
          <Badge variant="secondary" className="w-fit bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 hover:from-purple-200 hover:to-pink-200 transition-all duration-200">
            {service.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {service.description}
        </p>

        {/* Prix */}
        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-700">
            {formatPrice(service.price, service.price_type)}
          </span>
        </div>

        {/* Localisation */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>{service.location}</span>
        </div>

        {/* Profil du prestataire */}
        {service.profiles && (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <Avatar className="h-8 w-8">
              <AvatarImage src={service.profiles.avatar_url || ''} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {service.profiles.full_name || service.profiles.username || 'Utilisateur'}
              </p>
              {service.profiles.location && (
                <p className="text-xs text-gray-500 truncate">
                  {service.profiles.location}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {service.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 transition-all duration-200">
                {tag}
              </Badge>
            ))}
            {service.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 transition-all duration-200">
                +{service.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Statistiques */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <ServiceViewsSimple 
            totalViews={service.total_views}
            views={service.views}
            className="text-xs"
          />
          {service.rating && service.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{service.rating.toFixed(1)}</span>
              {service.reviews_count && service.reviews_count > 0 && (
                <span className="text-gray-400">({service.reviews_count})</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(service.created_at), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        {showActions ? (
          /* Actions pour le propriétaire */
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(service)}
              className="flex-1"
            >
              Modifier
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(service)}
              className="flex-1"
            >
              Supprimer
            </Button>
          </div>
        ) : (
          /* Actions pour les visiteurs */
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 border-blue-200 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200"
            >
              <Link href={`/services/${service.id}`}>
                Voir détails
              </Link>
            </Button>
            
            {(service.contact_info?.phone || service.contact_info?.email) && (
              <Button
                size="sm"
                onClick={() => onContact?.(service)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Phone className="h-4 w-4 mr-1" />
                Contacter
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * Composant de carte de service en mode compact
 */
export function ServiceCardCompact({ service }: { service: ServiceWithProfile }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm hover:scale-[1.01] rounded-xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Image miniature */}
          {service.images && service.images.length > 0 && (
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-service.jpg';
                }}
              />
            </div>
          )}

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-sm line-clamp-1 flex-1">
                <Link 
                  href={`/services/${service.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {service.title}
                </Link>
              </h4>
              <Badge variant="secondary" className="text-xs ml-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
                {service.category}
              </Badge>
            </div>
            
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {service.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{service.location}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1 rounded-lg border border-green-100">
                <DollarSign className="h-3 w-3" />
                <span>
                  {service.price === 0 ? 'Gratuit' : `${service.price}€`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}