import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase';

// Client administrateur Supabase, généré côté serveur
const getAdmin = async () => createServerAdminClient()

/**
 * POST - Modère du contenu (masquer ou supprimer)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, contentId, contentType, action, reason, targetUserId } = body;

    if (!contentId || !contentType || !action || !['hide', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Paramètres invalides' },
        { status: 400 }
      );
    }

    // Déterminer la table en fonction du type de contenu
    let tableName = '';
    switch (contentType) {
      case 'post':
        tableName = 'posts';
        break;
      case 'comment':
        tableName = 'comments';
        break;
      case 'service':
        tableName = 'services';
        break;
      case 'announcement':
        tableName = 'announcements';
        break;
      case 'product':
        tableName = 'products';
        break;
      default:
        return NextResponse.json(
          { error: 'Type de contenu non supporté' },
          { status: 400 }
        );
    }

    const supabaseAdmin = await getAdmin()
    if (action === 'hide') {
      // Masquer le contenu
      const { error } = await supabaseAdmin
        .from(tableName)
        .update({ is_hidden: true })
        .eq('id', contentId);

      if (error) {
        console.error('Erreur lors du masquage:', error);
        return NextResponse.json(
          { error: 'Erreur lors du masquage du contenu' },
          { status: 500 }
        );
      }
    } else {
      // Supprimer le contenu
      const { error } = await supabaseAdmin
        .from(tableName)
        .delete()
        .eq('id', contentId);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        return NextResponse.json(
          { error: 'Erreur lors de la suppression du contenu' },
          { status: 500 }
        );
      }
    }

    // Enregistrer l'action de modération
    const { error: actionError } = await supabaseAdmin
      .from('moderation_actions')
      .insert({
        action_type: action === 'hide' ? 'hide_content' : 'delete_content',
        target_user_id: targetUserId,
        content_id: contentId,
        content_type: contentType,
        reason,
        moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757'
      });

    if (actionError) {
      console.warn('Erreur lors de l\'enregistrement de l\'action:', actionError);
    }

    // Marquer le signalement comme résolu si un reportId est fourni
    if (reportId) {
      const { error: reportError } = await supabaseAdmin
        .from('reports')
        .update({
          status: 'resolved',
          moderator_notes: `Contenu ${action === 'hide' ? 'masqué' : 'supprimé'}`,
          moderator_id: 'de6bf9a0-9c39-4679-8851-d30327526757',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (reportError) {
        console.warn('Erreur lors de la mise à jour du signalement:', reportError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Contenu ${action === 'hide' ? 'masqué' : 'supprimé'} avec succès` 
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
