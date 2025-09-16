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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error(error);
          router.replace('/');
          return;
        }

        if (data && allowedRoles.includes(data.role)) {
          setAuthorized(true);
        } else {
          router.replace('/');
        }
        setLoading(false);
      };

      checkRole();
    }, [router]);

    if (loading) return <div>Loading...</div>;
    if (!authorized) return <div>Access Denied</div>;
    return <WrappedComponent {...props} />;
  };
}