"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

import { ProtectedLayout } from "@/components/layout/protected-layout";
import { Header } from "@/components/layout/Header";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, MapPin, Euro, Tag, FileText, Camera, AlertCircle, CheckCircle, Phone } from "lucide-react";

const categories = [
  "Véhicules",
  "Immobilier",
  "Emploi",
  "Mode",
  "Maison",
  "Multimédia",
  "Loisirs",
  "Matériel Professionnel",
  "Autres",
];

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // Étapes du formulaire
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    images: [] as string[],
    phone_number: "",
    contact_email: "",
  });

  // Validation du formulaire
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Le titre est obligatoire";
    } else if (formData.title.length < 5) {
      errors.title = "Le titre doit contenir au moins 5 caractères";
    }
    
    if (!formData.description.trim()) {
      errors.description = "La description est obligatoire";
    } else if (formData.description.length < 20) {
      errors.description = "La description doit contenir au moins 20 caractères";
    }
    
    if (!formData.category) {
      errors.category = "Veuillez sélectionner une catégorie";
    }
    
    if (!formData.location.trim()) {
      errors.location = "La localisation est obligatoire";
    }
    
    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      errors.price = "Le prix doit être un nombre positif";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation du formulaire
    if (!validateForm()) {
      setError("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFormErrors({});

      const { error } = await supabase.from("announcements").insert({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.category,
        location: formData.location.trim(),
        images: formData.images,
        user_id: user.id,
        phone_number: formData.phone_number.trim() || null,
        contact_email: formData.contact_email.trim() || null,
      });

      if (error) throw error;
      
      setSuccess(true);
      
      // Redirection après un délai pour montrer le message de succès
      setTimeout(() => {
        router.push("/annonces");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce:", error);
      setError("Une erreur est survenue lors de la publication");

      // Clean up uploaded images
      try {
        await Promise.all(
          formData.images.map(async (url) => {
            const path = url.split("/").pop();
            await supabase.storage
              .from("announcements-images")
              .remove([`announcements/${path}`]);
          })
        );
        setFormData((prev) => ({ ...prev, images: [] }));
      } catch (cleanupError) {
        console.error("Erreur lors du nettoyage des images:", cleanupError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Message de succès
  if (success) {
    return (
      <ProtectedLayout>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-800 mb-2">Annonce créée avec succès !</h1>
              <p className="text-green-600">Vous allez être redirigé vers la liste des annonces...</p>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* En-tête avec bouton retour */}
            <div className="flex items-center mb-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Déposer une annonce</h1>
                <p className="text-gray-600 mt-1">Partagez vos produits et services avec la communauté</p>
              </div>
            </div>

            {/* Indicateur de progression */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Étape {step} sur 3</span>
                <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% complété</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Messages d'erreur globaux */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Formulaire */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Étape 1: Informations de base */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Informations de base
                    </h2>
                    <p className="text-gray-600 mt-1">Décrivez votre annonce en quelques mots</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Titre de l'annonce *
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value });
                          if (formErrors.title) {
                            setFormErrors({ ...formErrors, title: "" });
                          }
                        }}
                        placeholder="Ex: iPhone 13 Pro en excellent état"
                        className={`mt-1 ${formErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                        maxLength={100}
                      />
                      {formErrors.title && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">{formData.title.length}/100 caractères</p>
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Catégorie *
                      </Label>
                      <div className="relative mt-1">
                        <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => {
                            setFormData({ ...formData, category: e.target.value });
                            if (formErrors.category) {
                              setFormErrors({ ...formErrors, category: "" });
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formErrors.category && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                        Prix (optionnel)
                      </Label>
                      <div className="relative mt-1">
                        <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => {
                            setFormData({ ...formData, price: e.target.value });
                            if (formErrors.price) {
                              setFormErrors({ ...formErrors, price: "" });
                            }
                          }}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`pl-10 ${formErrors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                      </div>
                      {formErrors.price && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">Laissez vide si gratuit ou sur demande</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description détaillée *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                        if (formErrors.description) {
                          setFormErrors({ ...formErrors, description: "" });
                        }
                      }}
                      placeholder="Décrivez votre annonce en détail : état, caractéristiques, conditions de vente..."
                      rows={6}
                      className={`mt-1 resize-none ${formErrors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                      maxLength={1000}
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">{formData.description.length}/1000 caractères</p>
                  </div>
                </div>

                {/* Étape 2: Photos */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-blue-600" />
                      Photos de l'annonce
                    </h2>
                    <p className="text-gray-600 mt-1">Ajoutez des photos pour attirer l'attention</p>
                  </div>

                  <div className="space-y-4">
                    <ImageUpload
                      value={formData.images}
                      onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                      onRemove={(url) =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((imageUrl) => imageUrl !== url),
                        }))
                      }
                    />
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Upload className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Conseils pour de bonnes photos</h4>
                          <ul className="text-sm text-blue-700 mt-1 space-y-1">
                            <li>• Prenez des photos nettes et bien éclairées</li>
                            <li>• Montrez l'objet sous différents angles</li>
                            <li>• Évitez les photos floues ou trop sombres</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Étape 3: Localisation */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      Localisation
                    </h2>
                    <p className="text-gray-600 mt-1">Où se trouve votre annonce ?</p>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Ville ou région *
                    </Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={(e) => {
                          setFormData({ ...formData, location: e.target.value });
                          if (formErrors.location) {
                            setFormErrors({ ...formErrors, location: "" });
                          }
                        }}
                        placeholder="Ex: Cayenne, Guyane"
                        className={`pl-10 ${formErrors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>
                    {formErrors.location && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
                    )}
                  </div>
                </div>

                {/* Étape 4: Informations de contact */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-blue-600" />
                      Informations de contact
                    </h2>
                    <p className="text-gray-600 mt-1">Comment les acheteurs peuvent vous contacter (optionnel)</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                        Numéro de téléphone
                      </Label>
                      <Input
                        type="tel"
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={(e) => {
                          setFormData({ ...formData, phone_number: e.target.value });
                        }}
                        placeholder="Ex: +594 694 00 00 00"
                        className="mt-1"
                      />
                      <p className="text-gray-500 text-xs mt-1">Laissez vide pour utiliser le n° de votre profil</p>
                    </div>

                    <div>
                      <Label htmlFor="contact_email" className="text-sm font-medium text-gray-700">
                        Adresse email
                      </Label>
                      <Input
                        type="email"
                        id="contact_email"
                        value={formData.contact_email}
                        onChange={(e) => {
                          setFormData({ ...formData, contact_email: e.target.value });
                        }}
                        placeholder="Ex: contact@example.com"
                        className="mt-1"
                      />
                      <p className="text-gray-500 text-xs mt-1">Laissez vide pour utiliser l'email de votre profil</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Confidentialité</h4>
                        <p className="text-sm text-amber-700 mt-1">Vos coordonnées seront masquées jusqu'au premier contact. Vous contrôlez ce qui est affiché.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/annonces")}
                      className="w-full sm:w-auto"
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Publication en cours...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Publier l'annonce
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
