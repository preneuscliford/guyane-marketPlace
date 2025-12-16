import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase';

const getAdmin = async () => createServerAdminClient()

/**
 * GET - Récupère tous les signalements
 */
export async function GET() {
  try {
    const supabaseAdmin = await getAdmin()
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select(`
        *,
        reporter_profile:profiles!reporter_id(username, avatar_url),
        reported_profile:profiles!reported_user_id(username, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des signalements:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des signalements' },
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
 * PUT - Met à jour un signalement
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, moderator_notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID et statut requis' },
        { status: 400 }
      );
    }

    const supabaseAdmin = await getAdmin()
    const { data, error } = await supabaseAdmin
      .from('reports')
      .update({
        status,
        moderator_notes,
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757', // ID admin fixe
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du signalement:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du signalement' },
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
