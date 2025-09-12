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
 * GET - Récupère les statistiques d'administration
 */
export async function GET() {
  try {
    // Récupération des statistiques de base
    const [reportsResult, usersResult, bannedUsersResult, moderationActionsResult] = await Promise.all([
      supabaseAdmin.from('reports').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('banned_users').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('moderation_actions').select('id', { count: 'exact', head: true })
    ]);

    // Récupération des signalements par statut
    const [pendingReports, resolvedReports] = await Promise.all([
      supabaseAdmin.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'resolved')
    ]);

    const stats = {
      totalReports: reportsResult.count || 0,
      pendingReports: pendingReports.count || 0,
      resolvedReports: resolvedReports.count || 0,
      totalUsers: usersResult.count || 0,
      bannedUsers: bannedUsersResult.count || 0,
      totalModerationActions: moderationActionsResult.count || 0
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}