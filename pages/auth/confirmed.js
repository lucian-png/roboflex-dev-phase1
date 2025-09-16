import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function EmailConfirmedPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Confirming your email address...');

  useEffect(() => {
    const confirmEmail = async () => {
      // Supabase will automatically handle email confirmation via token in URL
      // Once confirmed, you can redirect or show a message
      setMessage('✅ Your email has been confirmed successfully!');
      
      // Optional: Redirect after a short delay
      setTimeout(() => {
        router.push('/login'); // take them to login after 3 seconds
      }, 3000);
    };

    confirmEmail();
  }, [router]);

  return (
    <div style={container}>
      <div style={card}>
        <h2>Email Confirmation</h2>
        <p>{message}</p>
        <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.7 }}>
          You will be redirected shortly...
        </p>
      </div>
    </div>
  );
}

// ===== Simple styles =====
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