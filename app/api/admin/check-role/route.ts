import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Vérifie le rôle de l'utilisateur connecté - Debug version
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Vérifier l'authentification
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.log('Session error ou pas de session:', sessionError, !!session);
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    console.log('Session trouvée pour utilisateur:', session.user.id);

    // Récupérer le rôle de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Erreur lors de la récupération du profil:', profileError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du profil' },
        { status: 500 }
      );
    }

    console.log('Profil trouvé:', profile);

    return NextResponse.json({
      role: profile?.role || 'user'
    });

  } catch (error) {
    console.error('Erreur dans check-role:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}