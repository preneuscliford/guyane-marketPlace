import { NextRequest, NextResponse } from 'next/server';
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
 * GET - Récupère toutes les actions de modération
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('moderation_actions')
      .select(`
        *,
        moderator:profiles!moderator_id(username),
        target_user:profiles!target_user_id(username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des actions de modération:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des actions de modération' },
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
 * POST - Crée une nouvelle action de modération
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action_type, target_user_id, content_id, content_type, reason } = body;

    if (!action_type || !target_user_id || !reason) {
      return NextResponse.json(
        { error: 'Type d\'action, utilisateur cible et raison requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('moderation_actions')
      .insert({
        action_type,
        target_user_id,
        content_id,
        content_type,
        reason,
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757' // ID admin fixe
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'action de modération:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'action de modération' },
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