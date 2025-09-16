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
         console.log('=== withRole Debug Start ===');

         const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
         console.log('Session Error:', sessionError);
         console.log('Session Data:', sessionData);

         const { data: { user }, error: userError } = await supabase.auth.getUser();
         console.log('User Error:', userError);
         console.log('User Data:', user);

         if (!user) {
           console.warn('No user found — redirecting to /login');
           router.replace('/login');
           return;
         }

        const { data: profile, error: profileError } = await supabase
           .from('profiles')
           .select('role')
           .eq('id', user.id)
           .single();

         console.log('Profile Error:', profileError);
         console.log('Profile Data:', profile);

         if (profile && allowedRoles.includes(profile.role)) {
           console.log('User is authorized ✅');
           setAuthorized(true);
         } else {
           console.warn('User is NOT authorized, redirecting ⛔');
           router.replace('/');
         }

         setLoading(false);
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