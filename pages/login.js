import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import AuthFormLayout from '../components/layout/AuthFormLayout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let authError = null;

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirmed`
        }
      });
      authError = error;
      setLoading(false);

      if (authError) {
        setError(authError.message);
      } else {
        router.push(`/signup-confirmation?email=${encodeURIComponent(email)}`);
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    authError = error;
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') router.push('/admin');
        else if (profile?.role === 'owner') router.push('/owner');
        else router.push('/');
      }
    }
  };

  return (
    <AuthFormLayout title={isSignUp ? 'Sign Up' : 'Login'}>
      <form onSubmit={handleAuth}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading
            ? (isSignUp ? 'Signing up...' : 'Logging in...')
            : (isSignUp ? 'Sign Up' : 'Login')}
        </button>

        {!isSignUp && (
          <p
            style={linkStyle}
            onClick={() => router.push('/reset-password')}
          >
            Forgot your password?
          </p>
        )}

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            style={toggleLinkStyle}
          >
            {isSignUp ? 'Login here' : 'Sign up here'}
          </span>
        </p>
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

const linkStyle = {
  fontSize: '0.9rem',
  textAlign: 'right',
  margin: '0.5rem 0 0',
  color: '#00aaff',
  cursor: 'pointer',
  textDecoration: 'underline'
};

const toggleLinkStyle = {
  color: '#00aaff',
  cursor: 'pointer',
  textDecoration: 'underline'
};