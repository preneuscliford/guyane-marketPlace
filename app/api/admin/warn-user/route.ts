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
 * POST - Avertit un utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, targetUserId, reason } = body;

    if (!targetUserId || !reason) {
      return NextResponse.json(
        { error: 'ID utilisateur et raison requis' },
        { status: 400 }
      );
    }

    // Enregistrer l'action de modération
    const { data, error: actionError } = await supabaseAdmin
      .from('moderation_actions')
      .insert({
        action_type: 'warn_user',
        target_user_id: targetUserId,
        reason,
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757'
      })
      .select()
      .single();

    if (actionError) {
      console.error('Erreur lors de l\'avertissement:', actionError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'avertissement de l\'utilisateur' },
        { status: 500 }
      );
    }

    // Marquer le signalement comme résolu si un reportId est fourni
    if (reportId) {
      const { error: reportError } = await supabaseAdmin
        .from('reports')
        .update({
          status: 'resolved',
          moderator_notes: `Utilisateur averti: ${reason}`,
          moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (reportError) {
        console.warn('Erreur lors de la mise à jour du signalement:', reportError);
      }
    }

    return NextResponse.json({ 
      data, 
      message: 'Utilisateur averti avec succès' 
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}