import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec la clé de service (côté serveur uniquement)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * GET - Récupère tous les utilisateurs avec leurs informations de profil
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at,
        phone,
        location
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des utilisateurs' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Met à jour les informations d'un utilisateur
 */
export async function PUT(request: Request) {
  try {
    const { userId, updates } = await request.json();

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Validation des champs autorisés à être mis à jour
    const allowedFields = [
      'role',
      'username',
      'full_name',
      'phone',
      'location'
    ];

    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: 'Aucun champ valide à mettre à jour' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        ...filteredUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data,
      message: 'Utilisateur mis à jour avec succès' 
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}