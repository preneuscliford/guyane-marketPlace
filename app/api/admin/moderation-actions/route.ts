import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase';

const getAdmin = async () => createServerAdminClient()

/**
 * GET - Récupère toutes les actions de modération
 */
export async function GET() {
  try {
    const supabaseAdmin = await getAdmin()
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

    const supabaseAdmin = await getAdmin()
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
