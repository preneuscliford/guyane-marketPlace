import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase';

const getAdmin = async () => createServerAdminClient()

/**
 * POST - Résout un signalement
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, notes } = body;

    if (!action || !['approve', 'dismiss'].includes(action)) {
      return NextResponse.json(
        { error: 'Action invalide (approve ou dismiss requis)' },
        { status: 400 }
      );
    }

    const status = action === 'approve' ? 'resolved' : 'dismissed';

    const supabaseAdmin = await getAdmin()
    const { data, error } = await supabaseAdmin
      .from('reports')
      .update({
        status,
        moderator_notes: notes,
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757', // ID admin fixe
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la résolution du signalement:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la résolution du signalement' },
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
