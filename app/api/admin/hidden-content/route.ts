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
 * GET - Récupère le contenu masqué (services et annonces cachés)
 */
export async function GET() {
  try {
    // Récupération des services masqués
    const { data: hiddenServices, error: servicesError } = await supabaseAdmin
      .from('services')
      .select(`
        id,
        title,
        description,
        created_at,
        is_hidden,
        profiles!services_user_id_fkey(username, avatar_url)
      `)
      .eq('is_hidden', true)
      .order('created_at', { ascending: false });

    if (servicesError) {
      console.error('Erreur lors de la récupération des services masqués:', servicesError);
    }

    // Récupération des annonces masquées (si la table existe)
    const { data: hiddenAnnouncements, error: announcementsError } = await supabaseAdmin
      .from('announcements')
      .select(`
        id,
        title,
        description,
        created_at,
        is_hidden,
        profiles!announcements_user_id_fkey(username, avatar_url)
      `)
      .eq('is_hidden', true)
      .order('created_at', { ascending: false });

    if (announcementsError) {
      console.error('Erreur lors de la récupération des annonces masquées:', announcementsError);
    }

    const data = {
      hiddenServices: hiddenServices || [],
      hiddenAnnouncements: hiddenAnnouncements || []
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu masqué:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contenu masqué' },
      { status: 500 }
    );
  }
}

/**
 * POST - Masque ou affiche du contenu
 */
export async function POST(request: Request) {
  try {
    const { contentType, contentId, isHidden } = await request.json();

    if (!contentType || !contentId || typeof isHidden !== 'boolean') {
      return NextResponse.json(
        { error: 'Paramètres manquants ou invalides' },
        { status: 400 }
      );
    }

    let result;
    if (contentType === 'service') {
      result = await supabaseAdmin
        .from('services')
        .update({ is_hidden: isHidden })
        .eq('id', contentId);
    } else if (contentType === 'announcement') {
      result = await supabaseAdmin
        .from('announcements')
        .update({ is_hidden: isHidden })
        .eq('id', contentId);
    } else {
      return NextResponse.json(
        { error: 'Type de contenu invalide' },
        { status: 400 }
      );
    }

    if (result.error) {
      console.error('Erreur lors de la mise à jour du contenu:', result.error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du contenu' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: `Contenu ${isHidden ? 'masqué' : 'affiché'} avec succès` 
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}