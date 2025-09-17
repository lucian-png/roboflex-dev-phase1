import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient';

export default function withRole(WrappedComponent, allowedRoles) {
  return function RoleWrapper(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const checkAndCreateProfile = async () => {
        console.log('=== withRole Debug Mode ===');
        console.log('Allowed Roles for this page:', allowedRoles);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) console.error('Session error:', sessionError);

        if (!session || !session.user) {
          console.warn('No active session → redirecting to /login');
          router.replace('/login');
          return;
        }

        const currentEmail = session.user.email;
        console.log('User email:', currentEmail);

        // Try to get profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) console.error('Profile fetch error:', profileError);

        if (!profile) {
          console.warn('No profile row found for this user.');

          // SAFETY CHECK — only auto‑insert admin for specific emails
          const adminWhitelist = ['lucian@roboflex.co']; // <-- Add your email(s) here

          if (adminWhitelist.includes(currentEmail)) {
            console.log('Whitelisted email — inserting admin row...');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  email: currentEmail,
                  role: 'admin'
                }
              ]);

            if (insertError) {
              console.error('Error inserting admin profile:', insertError);
              setLoading(false);
              return;
            }
            console.log('✅ Admin profile inserted for', currentEmail);
            setAuthorized(true);
            setLoading(false);
            return;
          } else {
            console.warn('Email is not whitelisted — redirecting to home.');
            router.replace('/');
            return;
          }
        }

        console.log('Existing profile found:', profile);

        if (allowedRoles.includes(profile.role)) {
          setAuthorized(true);
        } else {
          router.replace('/');
        }

        setLoading(false);
      };

      checkAndCreateProfile();
    }, [router, allowedRoles]);

    if (loading) return <div>Loading...</div>;
    if (!authorized) return <div>Access Denied</div>;
    return <WrappedComponent {...props} />;
  };
}