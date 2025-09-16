import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function withRole(WrappedComponent, allowedRoles) {
  return function RoleWrapper(props) {
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
      const checkRole = async () => {
        console.log('=== withRole Debug Mode ===');
        console.log('Allowed Roles for this page:', allowedRoles);
        console.log('ENV NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
        console.log('ENV NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session Error:', sessionError);
        console.log('Session Data:', session);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('User Error:', userError);
        console.log('User Data:', user);

        let profile = null;
        let profileError = null;

        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          profile = data;
          profileError = error;
        }

        console.log('Profile Error:', profileError);
        console.log('Profile Data:', profile);

        setDebugInfo({
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          allowedRoles,
          session,
          user,
          profile,
          errors: { sessionError, userError, profileError }
        });

        setLoading(false);
      };

      checkRole();
    }, [allowedRoles]);

    if (loading) return <div>Loading debug info...</div>;

    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h2>withRole Debug Output</h2>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #444' }}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
}