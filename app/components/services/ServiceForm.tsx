'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, MapPin, DollarSign, Tag } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import {
  CreateServiceData,
  UpdateServiceData,
  Service,
  SERVICE_CATEGORIES,
  PRICE_TYPES
} from '@/types/services';
import { toast } from 'sonner';

interface ServiceFormProps {
  service?: Service;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Composant de formulaire pour créer ou modifier un service
 */
export function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createService, updateService, loading } = useServices();
  
  // État du formulaire
  const [formData, setFormData] = useState<CreateServiceData>({
    title: '',
    description: '',
    category: '',
    price: 0,
    price_type: 'fixed',
    location: '',
    images: [],
    tags: [],
    contact_phone: '',
    contact_email: '',
    availability: 'available'
  });
  
  const [newTag, setNewTag] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données du service existant
  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.price,
        price_type: service.price_type,
        location: service.location,
        images: service.images || [],
        tags: service.tags || [],
        contact_phone: service.contact_phone || '',
        contact_email: service.contact_email || '',
        availability: service.availability
      });
      setImageUrls(service.images || []);
    }
  }, [service]);

  /**
   * Valide les données du formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }
    if (formData.price < 0) {
      newErrors.price = 'Le prix ne peut pas être négatif';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est requise';
    }
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour créer un service');
      return;
    }

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      const serviceData = {
        ...formData,
        images: imageUrls
      };

      if (service) {
        // Mise à jour
        await updateService(service.id, serviceData as UpdateServiceData);
        toast.success('Service mis à jour avec succès!');
      } else {
        // Création
        await createService(serviceData);
        toast.success('Service créé avec succès!');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/services');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  /**
   * Ajoute un tag
   */
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  /**
   * Supprime un tag
   */
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Ajoute une URL d'image
   */
  const addImageUrl = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url && url.trim()) {
      setImageUrls(prev => [...prev, url.trim()]);
    }
  };

  /**
   * Supprime une URL d'image
   */
  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          {service ? 'Modifier le service' : 'Créer un nouveau service'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du service *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Réparation d'ordinateurs"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre service en détail..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Prix et localisation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_type">Type de prix</Label>
              <Select
                value={formData.price_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, price_type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: Cayenne, Kourou..."
                  className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Téléphone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="Ex: 0594 XX XX XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="contact@exemple.com"
                className={errors.contact_email ? 'border-red-500' : ''}
              />
              {errors.contact_email && <p className="text-sm text-red-500">{errors.contact_email}</p>}
            </div>
          </div>

          {/* Disponibilité */}
          <div className="space-y-2">
            <Label htmlFor="availability">Disponibilité</Label>
            <Select
              value={formData.availability}
              onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="busy">Occupé</SelectItem>
                <SelectItem value="unavailable">Indisponible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Ajouter un tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images</Label>
            <Button type="button" onClick={addImageUrl} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Ajouter une image
            </Button>
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'En cours...' : (service ? 'Mettre à jour' : 'Créer le service')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => router.back())}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}