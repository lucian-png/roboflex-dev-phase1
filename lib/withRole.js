import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient';

export default function withRole(WrappedComponent, allowedRoles) {
  return function RoleWrapper(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const checkRole = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user:', userError.message);
        }

        if (!user) {
          console.warn('No authenticated user found, redirecting to /login');
          router.replace('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile role:', profileError.message);
          router.replace('/');
          return;
        }

        if (!profile) {
          console.warn('No profile found for this user. Role gating denied.');
          router.replace('/');
          return;
        }

        console.log('User role from profiles table:', profile.role);
        console.log('Allowed roles for this page are:', allowedRoles);

        if (allowedRoles.includes(profile.role.trim().toLowerCase())) {
          setAuthorized(true);
        } else {
          console.warn(`Role "${profile.role}" is not allowed here.`);
          router.replace('/');
        }

        setLoading(false);
      };

      checkRole();
    }, [router, allowedRoles]);

    if (loading) return <div>Loading...</div>;
    if (!authorized) return <div>Access Denied</div>;
    return <WrappedComponent {...props} />;
  };
}