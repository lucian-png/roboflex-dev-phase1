import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient';

export default function withRole(WrappedComponent, allowedRoles) {
  return function RoleWrapper(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      let mounted = true; // avoid setting state on unmounted

      const checkRole = async () => {
        console.log('🔍 Starting role check...');

        // 1. Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) console.error('Session error:', sessionError);

        if (!session || !session.user) {
          console.warn('⚠ No active session found, redirecting to /login');
          router.replace('/login');
          return;
        }

        console.log('✅ Session found for user:', session.user.email);

        // 2. Query profiles table for role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('❌ Error fetching profile role:', profileError.message);
          router.replace('/');
          return;
        }

        if (!profile) {
          console.warn('⚠ No profile row found for this user, redirecting');
          router.replace('/');
          return;
        }

        console.log(`🔑 Role for ${session.user.email} is:`, profile.role);

        // 3. Check if role is allowed
        const normalizedRole = profile.role.trim().toLowerCase();
        if (allowedRoles.map(r => r.toLowerCase()).includes(normalizedRole)) {
          console.log('✅ User authorized for this page.');
          if (mounted) setAuthorized(true);
        } else {
          console.warn(`🚫 Role "${profile.role}" is not allowed here.`);
          router.replace('/');
        }

        if (mounted) setLoading(false);
      };

      // Run immediately on mount
      checkRole();

      // Also re-check when auth state changes (login/logout)
      const { data: listener } = supabase.auth.onAuthStateChange(() => {
        checkRole();
      });

      return () => {
        mounted = false;
        listener?.subscription.unsubscribe();
      };
    }, [router, allowedRoles]);

    if (loading) return <div>Loading...</div>;
    if (!authorized) return <div>Access Denied</div>;
    return <WrappedComponent {...props} />;
  };
}