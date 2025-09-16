import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // toggle between login/signup

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let authError = null;

    if (isSignUp) {
      // Sign up new user
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirmed`
        }
      });
      authError = error;
    } else {
      // Login existing user
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      authError = error;
    }

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      // After signup/login, redirect based on role if available
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          router.push('/admin');
        } else if (profile?.role === 'owner') {
          router.push('/owner');
        } else {
          router.push('/');
        }
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#111',
      color: 'white'
    }}>
      <form
        onSubmit={handleAuth}
        style={{
          background: '#1e1e1e',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>

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

        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#0066cc',
            color: 'white',
            border: 'none',
            padding: '0.75rem',
            cursor: 'pointer',
            width: '100%',
            marginTop: '1rem'
          }}
        >
          {loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
        </button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: '#00aaff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isSignUp ? 'Login here' : 'Sign up here'}
          </span>
        </p>
      </form>
    </div>
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