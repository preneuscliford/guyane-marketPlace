import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase';

const getAdmin = async () => createServerAdminClient()

/**
 * GET - Récupère les statistiques d'administration
 */
export async function GET() {
  try {
    const supabaseAdmin = await getAdmin()
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
