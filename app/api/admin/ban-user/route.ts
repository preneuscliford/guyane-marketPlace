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
 * POST - Bannit un utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, targetUserId, user_id, reason, is_permanent, banned_until, duration } = body;
    
    // Support pour les deux formats d'API
    const userId = targetUserId || user_id;
    const bannedUntil = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : banned_until;

    if (!userId || !reason) {
      return NextResponse.json(
        { error: 'ID utilisateur et raison requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur est déjà banni
    const { data: existingBan } = await supabaseAdmin
      .from('banned_users')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingBan) {
      return NextResponse.json(
        { error: 'Utilisateur déjà banni' },
        { status: 400 }
      );
    }

    // Créer l'entrée de bannissement
    const { data: banData, error: banError } = await supabaseAdmin
      .from('banned_users')
      .insert({
        user_id: userId,
        reason,
        is_permanent: is_permanent || !duration,
        banned_until: (is_permanent || !duration) ? null : bannedUntil?.toISOString(),
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757', // ID admin fixe
        banned_at: new Date().toISOString()
      })
      .select()
      .single();

    if (banError) {
      console.error('Erreur lors du bannissement:', banError);
      return NextResponse.json(
        { error: 'Erreur lors du bannissement de l\'utilisateur' },
        { status: 500 }
      );
    }

    // Enregistrer l'action de modération
    const { error: actionError } = await supabaseAdmin
      .from('moderation_actions')
      .insert({
        action_type: 'ban_user',
        target_user_id: userId,
        reason,
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757'
      });

    if (actionError) {
      console.error('Erreur lors de l\'enregistrement de l\'action:', actionError);
    }

    // Marquer le signalement comme résolu si un reportId est fourni
    if (reportId) {
      const banType = duration ? `${duration} jours` : 'définitivement';
      const { error: reportError } = await supabaseAdmin
        .from('reports')
        .update({
          status: 'resolved',
          moderator_notes: `Utilisateur banni ${banType}: ${reason}`,
          moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (reportError) {
        console.warn('Erreur lors de la mise à jour du signalement:', reportError);
      }
    }

    return NextResponse.json({ 
      data: banData,
      message: `Utilisateur banni ${duration ? duration + ' jours' : 'définitivement'} avec succès`
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Débannit un utilisateur
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Supprimer l'entrée de bannissement
    const { error: deleteError } = await supabaseAdmin
      .from('banned_users')
      .delete()
      .eq('user_id', user_id);

    if (deleteError) {
      console.error('Erreur lors du débannissement:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors du débannissement de l\'utilisateur' },
        { status: 500 }
      );
    }

    // Enregistrer l'action de modération
    const { error: actionError } = await supabaseAdmin
      .from('moderation_actions')
      .insert({
        action_type: 'warn_user', // Utiliser warn_user comme type pour le débannissement
        target_user_id: user_id,
        reason: 'Débannissement',
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757'
      });

    if (actionError) {
      console.error('Erreur lors de l\'enregistrement de l\'action:', actionError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}