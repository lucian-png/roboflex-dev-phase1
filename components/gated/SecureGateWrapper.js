import { useState } from 'react';

export default function SecureGateWrapper({ children, contentKey }) {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/check-gate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, contentKey })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAuthed(true);
        setPassword('');
      } else {
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div style={{ padding: '2rem', minHeight: '100vh', background: 'black', color: 'white' }}>
        <form 
          onSubmit={handleLogin} 
          style={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }}
        >
          <h2>Enter Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <button 
            type="submit" 
            style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return <>{children}</>;
}