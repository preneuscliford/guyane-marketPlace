"use client";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

/**
 * Page de débogage pour vérifier l'état d'authentification
 */
export default function DebugPage() {
  const { user, session, loading, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  /**
   * Récupère le profil de l'utilisateur
   */
  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  };

  /**
   * Teste les requêtes vers les tables de modération
   */
  const testModerationQueries = async () => {
    const results = [];
    
    // Test table reports
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .limit(1);
      
      results.push({
        table: 'reports',
        success: !error,
        error: error?.message,
        count: data?.length || 0
      });
    } catch (error) {
      results.push({
        table: 'reports',
        success: false,
        error: (error as Error).message
      });
    }

    // Test table moderation_actions
    try {
      const { data, error } = await supabase
        .from('moderation_actions')
        .select('*')
        .limit(1);
      
      results.push({
        table: 'moderation_actions',
        success: !error,
        error: error?.message,
        count: data?.length || 0
      });
    } catch (error) {
      results.push({
        table: 'moderation_actions',
        success: false,
        error: (error as Error).message
      });
    }

    // Test table banned_users
    try {
      const { data, error } = await supabase
        .from('banned_users')
        .select('*')
        .limit(1);
      
      results.push({
        table: 'banned_users',
        success: !error,
        error: error?.message,
        count: data?.length || 0
      });
    } catch (error) {
      results.push({
        table: 'banned_users',
        success: false,
        error: (error as Error).message
      });
    }

    // Test table posts avec is_hidden
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_hidden', true)
        .limit(1);
      
      results.push({
        table: 'posts (is_hidden=true)',
        success: !error,
        error: error?.message,
        count: data?.length || 0
      });
    } catch (error) {
      results.push({
        table: 'posts (is_hidden=true)',
        success: false,
        error: (error as Error).message
      });
    }

    setTestResults(results);
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Page de Débogage - Authentification</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* État d'authentification */}
        <Card>
          <CardHeader>
            <CardTitle>État d'Authentification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Authentifié:</strong> {isAuthenticated ? 'Oui' : 'Non'}</p>
            <p><strong>Loading:</strong> {loading ? 'Oui' : 'Non'}</p>
            <p><strong>User ID:</strong> {user?.id || 'Non défini'}</p>
            <p><strong>Email:</strong> {user?.email || 'Non défini'}</p>
            <p><strong>Session:</strong> {session ? 'Présente' : 'Absente'}</p>
          </CardContent>
        </Card>

        {/* Profil utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile ? (
              <>
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Rôle:</strong> {profile.role}</p>
                <p><strong>Nom complet:</strong> {profile.full_name || 'Non défini'}</p>
                <p><strong>Créé le:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
              </>
            ) : (
              <p>Aucun profil trouvé</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test des requêtes */}
      <Card>
        <CardHeader>
          <CardTitle>Test des Requêtes de Modération</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testModerationQueries} className="mb-4">
            Tester les Requêtes
          </Button>
          
          {testResults.length > 0 && (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className={`p-3 rounded border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <p><strong>{result.table}:</strong> {result.success ? '✅ Succès' : '❌ Échec'}</p>
                  {result.error && <p className="text-red-600 text-sm">Erreur: {result.error}</p>}
                  {result.count !== undefined && <p className="text-sm">Résultats: {result.count}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations de session brutes */}
      <Card>
        <CardHeader>
          <CardTitle>Données Brutes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Session:</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold">User:</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold">Profile:</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}