'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, PhotoIcon, LinkIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useAdvertisements } from '../../hooks/useAdvertisements';
import { Advertisement, CreateAdvertisementData, UpdateAdvertisementData } from '../../types/advertisements';
import { Button } from '../ui/Button'; // Correction: majuscule pour correspondre au fichier Button.tsx
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Slider } from '../ui/Slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface AdvertisementFormProps {
  advertisement?: Advertisement | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Catégories disponibles
const CATEGORIES = [
  'Agriculture',
  'Artisanat',
  'Services',
  'Tourisme',
  'Commerce',
  'Immobilier',
  'Automobile',
  'Électronique',
  'Mode',
  'Alimentation',
  'Santé',
  'Éducation',
  'Sport',
  'Culture',
  'Autre'
];

// Communes de Guyane
const LOCATIONS = [
  'Cayenne',
  'Saint-Laurent-du-Maroni',
  'Kourou',
  'Matoury',
  'Rémire-Montjoly',
  'Macouria',
  'Mana',
  'Saint-Georges',
  'Sinnamary',
  'Iracoubo',
  'Roura',
  'Montsinéry-Tonnegrande',
  'Apatou',
  'Grand-Santi',
  'Papaïchton',
  'Saül',
  'Ouanary',
  'Régina',
  'Camopi',
  'Maripasoula',
  'Awala-Yalimapo',
  'Autre'
];

/**
 * Formulaire pour créer ou éditer une publicité
 */
export default function AdvertisementForm({
  advertisement,
  onClose,
  onSuccess
}: AdvertisementFormProps) {
  const { createAdvertisement, updateAdvertisement, loading } = useAdvertisements();
  
  const [formData, setFormData] = useState<CreateAdvertisementData>({
    title: '',
    description: '',
    image_url: '',
    target_url: '',
    category: '',
    location: '',
    budget: 10,
    daily_budget: 1,
    start_date: '',
    end_date: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);

  const isEditing = !!advertisement;

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (advertisement) {
      setFormData({
        title: advertisement.title,
        description: advertisement.description,
        image_url: advertisement.image_url || '',
        target_url: advertisement.target_url || '',
        category: advertisement.category || '',
        location: advertisement.location || '',
        budget: advertisement.budget,
        daily_budget: advertisement.daily_budget,
        start_date: advertisement.start_date ? advertisement.start_date.split('T')[0] : '',
        end_date: advertisement.end_date ? advertisement.end_date.split('T')[0] : ''
      });
    }
  }, [advertisement]);

  /**
   * Valide le formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    } else if (formData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }

    if (formData.budget < 1) {
      newErrors.budget = 'Le budget doit être d\'au moins 1€';
    } else if (formData.budget > 10000) {
      newErrors.budget = 'Le budget ne peut pas dépasser 10 000€';
    }

    if (formData.daily_budget < 0.5) {
      newErrors.daily_budget = 'Le budget quotidien doit être d\'au moins 0,50€';
    } else if (formData.daily_budget > formData.budget) {
      newErrors.daily_budget = 'Le budget quotidien ne peut pas dépasser le budget total';
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'L\'URL de l\'image n\'est pas valide';
    }

    if (formData.target_url && !isValidUrl(formData.target_url)) {
      newErrors.target_url = 'L\'URL de destination n\'est pas valide';
    }

    if (formData.end_date && formData.start_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = 'La date de fin doit être postérieure à la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Vérifie si une URL est valide
   */
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      if (isEditing && advertisement) {
        const updateData: UpdateAdvertisementData = { ...formData };
        await updateAdvertisement(advertisement.id, updateData);
        toast.success('Publicité mise à jour avec succès');
      } else {
        await createAdvertisement(formData);
        toast.success('Publicité créée avec succès');
      }
      
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      toast.error(errorMessage);
    }
  };

  /**
   * Met à jour un champ du formulaire
   */
  const updateField = (field: keyof CreateAdvertisementData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Calcule la durée estimée de la campagne
   */
  const calculateCampaignDuration = (): number => {
    if (formData.daily_budget <= 0) return 0;
    return Math.floor(formData.budget / formData.daily_budget);
  };

  /**
   * Calcule les impressions estimées
   */
  const calculateEstimatedImpressions = (): number => {
    // Estimation basée sur un CPM moyen de 2€
    const cpm = 2;
    return Math.floor((formData.budget / cpm) * 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier la publicité' : 'Créer une publicité'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Modifiez les paramètres de votre publicité' : 'Créez une nouvelle campagne publicitaire'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Éditer' : 'Aperçu'}
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {previewMode ? (
            <AdvertisementPreview formData={formData} />
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Informations de base */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Titre de la publicité *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="Ex: Découvrez nos produits locaux de qualité"
                        className={errors.title ? 'border-red-500' : ''}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">
                        {formData.title.length}/100 caractères
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Décrivez votre offre de manière attractive et détaillée..."
                        rows={4}
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">
                        {formData.description.length}/500 caractères
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">Localisation</Label>
                      <Select value={formData.location} onValueChange={(value) => updateField('location', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une commune" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATIONS.map(location => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Médias et liens */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhotoIcon className="w-5 h-5" />
                    Médias et liens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="image_url">URL de l'image</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => updateField('image_url', e.target.value)}
                      placeholder="https://exemple.com/image.jpg"
                      className={errors.image_url ? 'border-red-500' : ''}
                    />
                    {errors.image_url && (
                      <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      Recommandé: 1200x630px, format JPG ou PNG
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="target_url">URL de destination</Label>
                    <Input
                      id="target_url"
                      value={formData.target_url}
                      onChange={(e) => updateField('target_url', e.target.value)}
                      placeholder="https://votre-site.com"
                      className={errors.target_url ? 'border-red-500' : ''}
                    />
                    {errors.target_url && (
                      <p className="text-red-500 text-sm mt-1">{errors.target_url}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      Lien vers lequel les utilisateurs seront redirigés
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Budget et planification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BanknotesIcon className="w-5 h-5" />
                    Budget et planification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="budget">Budget total (€) *</Label>
                      <div className="space-y-3">
                        <Slider
                          value={[formData.budget]}
                          onValueChange={([value]) => updateField('budget', value)}
                          max={1000}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={formData.budget}
                          onChange={(e) => updateField('budget', parseFloat(e.target.value) || 0)}
                          min={1}
                          max={10000}
                          step={0.01}
                          className={errors.budget ? 'border-red-500' : ''}
                        />
                      </div>
                      {errors.budget && (
                        <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="daily_budget">Budget quotidien (€) *</Label>
                      <div className="space-y-3">
                        <Slider
                          value={[formData.daily_budget]}
                          onValueChange={([value]) => updateField('daily_budget', value)}
                          max={Math.min(formData.budget, 100)}
                          min={0.5}
                          step={0.1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={formData.daily_budget}
                          onChange={(e) => updateField('daily_budget', parseFloat(e.target.value) || 0)}
                          min={0.5}
                          max={formData.budget}
                          step={0.01}
                          className={errors.daily_budget ? 'border-red-500' : ''}
                        />
                      </div>
                      {errors.daily_budget && (
                        <p className="text-red-500 text-sm mt-1">{errors.daily_budget}</p>
                      )}
                    </div>
                  </div>

                  {/* Estimations */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Estimations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700">Durée estimée</p>
                        <p className="font-semibold text-blue-900">
                          {calculateCampaignDuration()} jours
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-700">Impressions estimées</p>
                        <p className="font-semibold text-blue-900">
                          {calculateEstimatedImpressions().toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-700">Clics estimés</p>
                        <p className="font-semibold text-blue-900">
                          {Math.floor(calculateEstimatedImpressions() * 0.02).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Options avancées */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Options avancées</Label>
                      <Switch
                        checked={advancedMode}
                        onCheckedChange={setAdvancedMode}
                      />
                    </div>
                    
                    {advancedMode && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="start_date">Date de début</Label>
                          <Input
                            id="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => updateField('start_date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div>
                          <Label htmlFor="end_date">Date de fin</Label>
                          <Input
                            id="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => updateField('end_date', e.target.value)}
                            min={formData.start_date || new Date().toISOString().split('T')[0]}
                            className={errors.end_date ? 'border-red-500' : ''}
                          />
                          {errors.end_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isEditing ? 'Mise à jour...' : 'Création...'}
                    </div>
                  ) : (
                    isEditing ? 'Mettre à jour' : 'Créer la publicité'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Composant d'aperçu de la publicité
 */
function AdvertisementPreview({ formData }: { formData: CreateAdvertisementData }) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Aperçu de votre publicité</h3>
      
      <div className="max-w-2xl mx-auto">
        {/* Aperçu carrousel */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl overflow-hidden shadow-soft">
          <div className="flex items-center p-6">
            {/* Image */}
            {formData.image_url && (
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mr-6">
                <img
                  src={formData.image_url}
                  alt={formData.title}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {formData.title || 'Titre de votre publicité'}
              </h3>
              <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-3">
                {formData.description || 'Description de votre publicité'}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500">
                {formData.category && (
                  <Badge variant="secondary">{formData.category}</Badge>
                )}
                {formData.location && (
                  <span className="flex items-center">
                    📍 {formData.location}
                  </span>
                )}
                <Badge className="bg-green-100 text-green-700">
                  Sponsorisé
                </Badge>
              </div>
            </div>

            {/* Indicateur de lien */}
            {formData.target_url && (
              <div className="flex-shrink-0 ml-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Informations de la campagne</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Budget total</p>
              <p className="font-semibold">{formData.budget}€</p>
            </div>
            <div>
              <p className="text-gray-600">Budget quotidien</p>
              <p className="font-semibold">{formData.daily_budget}€</p>
            </div>
            {formData.start_date && (
              <div>
                <p className="text-gray-600">Date de début</p>
                <p className="font-semibold">{new Date(formData.start_date).toLocaleDateString('fr-FR')}</p>
              </div>
            )}
            {formData.end_date && (
              <div>
                <p className="text-gray-600">Date de fin</p>
                <p className="font-semibold">{new Date(formData.end_date).toLocaleDateString('fr-FR')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}