'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, PhotoIcon, LinkIcon, BanknotesIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
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
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

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
  const { user } = useAuth();
  
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        start_date: advertisement.start_date ? new Date(advertisement.start_date).toISOString().split('T')[0] : '',
        end_date: advertisement.end_date ? new Date(advertisement.end_date).toISOString().split('T')[0] : '',
        is_active: advertisement.is_active
      });
      setImagePreview(advertisement.image_url || '');
    }
  }, [advertisement]);

  // Fonction pour gérer la sélection d'image
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour uploader l'image vers Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('Vous devez être connecté pour uploader une image');
      return null;
    }

    try {
      setUploadingImage(true);
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/ad-${Date.now()}.${fileExt}`;
      
      // Uploader le fichier
      const { data, error } = await supabase.storage
        .from('advertisements')
        .upload(fileName, file);
      
      if (error) {
        console.error('Erreur upload:', error);
        toast.error('Erreur lors de l\'upload de l\'image');
        return null;
      }
      
      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('advertisements')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Fonction pour supprimer l'image sélectionnée
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    updateField('image_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    console.log('🚀 Début de la soumission du formulaire');
    console.log('📝 Données du formulaire:', formData);
    
    if (!validateForm()) {
      console.log('❌ Validation échouée');
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    console.log('✅ Validation réussie');
    try {
      let finalImageUrl = formData.image_url;
      
      // Si un fichier image a été sélectionné, l'uploader d'abord
      if (imageFile) {
        console.log('📸 Upload d\'image en cours...');
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          console.log('✅ Image uploadée:', uploadedUrl);
        } else {
          console.log('❌ Échec de l\'upload d\'image');
          // Si l'upload échoue, arrêter la soumission
          return;
        }
      }

      const submissionData = {
        ...formData,
        image_url: finalImageUrl
      };
      console.log('📤 Données à soumettre:', submissionData);

      if (isEditing && advertisement) {
        console.log('🔄 Mise à jour de la publicité...');
        await updateAdvertisement(advertisement.id, submissionData as UpdateAdvertisementData);
        toast.success('Publicité mise à jour avec succès');
      } else {
        console.log('➕ Création de la publicité...');
        const result = await createAdvertisement(submissionData);
        console.log('✅ Publicité créée:', result);
        toast.success('Publicité créée avec succès');
      }
      
      onSuccess();
    } catch (err) {
      console.error('❌ Erreur lors de la soumission:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      toast.error(errorMessage);
    } finally {
      // Le loading est géré par le hook useAdvertisements
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
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
            <div className="p-6">
              <AdvertisementPreview formData={formData} />
            </div>
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
                  {/* Section upload d'image */}
                  <div>
                    <Label>Image de la publicité</Label>
                    <div className="mt-2">
                      {/* Zone d'aperçu de l'image */}
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        >
                          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-600 text-center">
                            <span className="font-medium">Cliquez pour uploader</span>
                            <br />
                            ou glissez-déposez votre image ici
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            PNG, JPG jusqu'à 5MB
                          </p>
                        </div>
                      )}
                      
                      {/* Input file caché */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      
                      {/* Boutons d'action */}
                      <div className="flex gap-2 mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                        >
                          <PhotoIcon className="w-4 h-4 mr-2" />
                          {imagePreview ? 'Changer l\'image' : 'Sélectionner une image'}
                        </Button>
                        
                        {imagePreview && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage}
                          >
                            <XMarkIcon className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        )}
                      </div>
                      
                      {uploadingImage && (
                        <div className="flex items-center gap-2 mt-2 text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                          <span className="text-sm">Upload en cours...</span>
                        </div>
                      )}
                    </div>
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