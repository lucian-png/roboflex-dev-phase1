import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import AuthFormLayout from '../components/layout/AuthFormLayout';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push('/login');
    }
  };

  return (
    <AuthFormLayout title="Set New Password">
      <form onSubmit={handleUpdate}>
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Updating...' : 'Update Password'}
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