"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { toast } from "sonner";

/**
 * Page de connexion pour les administrateurs
 * Permet de se connecter avec les identifiants admin pour accéder à la modération
 */
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Gère la connexion de l'administrateur
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Connexion avec Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Vérifier le rôle de l'utilisateur
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error(
            "Erreur lors de la récupération du profil:",
            profileError
          );
          toast.error("Erreur lors de la vérification du rôle");
          return;
        }

        if (profile?.role === "admin") {
          toast.success("Connexion réussie!");
          router.push("/admin/moderation");
        } else {
          toast.error("Accès refusé. Vous devez être administrateur.");
          await supabase.auth.signOut();
        }
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion rapide avec l'utilisateur admin existant
   */
  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      // Récupérer l'utilisateur admin existant
      const { data: adminProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "admin")
        .limit(1)
        .single();

      if (error || !adminProfile) {
        toast.error("Aucun administrateur trouvé dans la base de données");
        return;
      }

      // Pour le test, on va créer une session temporaire
      // En production, il faudrait utiliser les vraies credentials
      toast.info(`Utilisateur admin trouvé: ${adminProfile.username}`);
      toast.info("Veuillez utiliser vos identifiants de connexion normaux");
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la récupération des informations admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Connexion Admin
          </CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour accéder au panneau de modération
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <Button
              onClick={handleQuickLogin}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Vérifier l'admin existant
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>Admin existant: cliff50</p>
            <p className="text-xs mt-2">
              Utilisez vos identifiants Supabase Auth pour vous connecter
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
