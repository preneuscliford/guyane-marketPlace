import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase';

const getAdmin = async () => createServerAdminClient()

/**
 * GET - Récupère tous les utilisateurs bannis
 */
export async function GET() {
  try {
    const supabaseAdmin = await getAdmin()
    const { data, error } = await supabaseAdmin
      .from('banned_users')
      .select(`
        *,
        banned_user:profiles!banned_users_user_id_fkey(username, avatar_url),
        banned_by_user:profiles!banned_users_banned_by_fkey(username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs bannis:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des utilisateurs bannis' },
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
 * DELETE - Débannit un utilisateur
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    const supabaseAdmin = await getAdmin()
    // Supprimer l'entrée de bannissement
    const { error: deleteError } = await supabaseAdmin
      .from('banned_users')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Erreur lors du débannissement:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors du débannissement' },
        { status: 500 }
      );
    }

    // Enregistrer l'action de modération
    const { error: actionError } = await supabaseAdmin
      .from('moderation_actions')
      .insert({
        action_type: 'unban_user',
        target_user_id: userId,
        reason: 'Débannissement par un modérateur',
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757' // ID admin fixe
      });

    if (actionError) {
      console.error('Erreur lors de l\'enregistrement de l\'action:', actionError);
    }

    return NextResponse.json({ 
      message: 'Utilisateur débanni avec succès' 
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
