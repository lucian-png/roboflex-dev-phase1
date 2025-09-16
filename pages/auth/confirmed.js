import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function EmailConfirmedPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Confirming your email address...');

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        // Supabase stores the session automatically from the token in the URL fragment
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error(sessionError);
          setMessage('❌ There was an error confirming your email.');
          return;
        }

        if (!session || !session.user) {
          setMessage('❌ No active session found after confirmation.');
          return;
        }

        // Fetch the user's profile to get role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error(profileError);
          setMessage('✅ Email confirmed! Redirecting you to the homepage...');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // Auto-redirect based on role
        if (profile.role === 'admin') {
          setMessage('✅ Email confirmed! Redirecting you to the admin dashboard...');
          setTimeout(() => router.push('/admin'), 2000);
        } else if (profile.role === 'owner') {
          setMessage('✅ Email confirmed! Redirecting you to the owner portal...');
          setTimeout(() => router.push('/owner'), 2000);
        } else {
          setMessage('✅ Email confirmed! Redirecting you to the homepage...');
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (err) {
        console.error(err);
        setMessage('❌ An unexpected error occurred.');
      }
    };

    handleConfirmation();
  }, [router]);

  return (
    <div style={container}>
      <div style={card}>
        <h2>Email Confirmation</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

// ===== Styles =====
const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: '#111',
  color: 'white',
  fontFamily: 'sans-serif'
};

const card = {
  background: '#1e1e1e',
  padding: '2rem',
  borderRadius: '8px',
  maxWidth: '400px',
  textAlign: 'center',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)'
};