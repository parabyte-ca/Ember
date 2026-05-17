import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user) {
      // Check if onboarding is complete
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('id', user.id)
        .single();

      if (!profile?.onboarding_complete) {
        return NextResponse.redirect(`${origin}/onboarding/age-gate`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/auth/login?error=auth_error`);
}
