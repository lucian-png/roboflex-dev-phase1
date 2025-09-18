import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import AuthFormLayout from '../components/layout/AuthFormLayout';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure client-only render to avoid hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLoading(false);

      // Defer navigation so React finishes committing DOM updates first
      setTimeout(() => {
        router.push(`/reset-confirmation?email=${encodeURIComponent(email)}`);
      }, 0);
    }
  };

  // Prevent SSR mismatch by rendering nothing until client side is ready
  if (!mounted) return null;

  return (
    <AuthFormLayout title="Reset Password">
      <form onSubmit={handleResetRequest}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </AuthFormLayout>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  margin: '0.5rem 0 1rem 0',
  borderRadius: '4px',
  border: '1px solid #444',
  background: '#222',
  color: 'white'
};

const buttonStyle = {
  background: '#0066cc',
  color: 'white',
  border: 'none',
  padding: '0.75rem',
  cursor: 'pointer',
  width: '100%',
  marginTop: '1rem'
};