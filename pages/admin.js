import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'submitted_at',
    direction: 'desc'
  });

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin-get-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSubmissions(data.submissions);
      setAuthed(true);
    } else {
      setError(data.error || 'Login failed');
    }
  };

  const downloadCSV = async () => {
    try {
      const res = await fetch('/api/admin-export-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!res.ok) {
        throw new Error('Failed to download CSV');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'applications.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Error downloading CSV');
      console.error(err);
    }
  };

  if (!authed) {
    return (
      <div style={{ padding: '2rem', color: 'white', background: 'black', minHeight: '100vh' }}>
        <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: 'auto' }}>
          <h2>Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <button type="submit" style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}>
            {loading ? 'Loading...' : 'Login'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: 'white', background: 'black', minHeight: '100vh' }}>
      <h2>
        Applications{' '}
        <button
          onClick={downloadCSV}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            background: '#003366',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Download CSV
        </button>
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th} onClick={() => handleSort('name')}>Name</th>
            <th style={th} onClick={() => handleSort('email')}>Email</th>
            <th style={th} onClick={() => handleSort('phone')}>Phone</th>
            <th style={th} onClick={() => handleSort('occupation')}>Occupation</th>
            <th style={th} onClick={() => handleSort('country')}>Country</th>
            <th style={th} onClick={() => handleSort('message')}>Message</th>
            <th style={th} onClick={() => handleSort('submitted_at')}>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {sortedSubmissions.map((row) => (
            <tr key={row.id}>
              <td style={td}>{row.name}</td>
              <td style={td}>{row.email}</td>
              <td style={td}>{row.phone}</td>
              <td style={td}>{row.occupation}</td>
              <td style={td}>{row.country}</td>
              <td style={td}>{row.message}</td>
              <td style={td}>
                {row.submitted_at
                  ? new Date(row.submitted_at).toLocaleString()
                  : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  borderBottom: '1px solid #555',
  padding: '8px',
  textAlign: 'left',
  background: '#111',
  cursor: 'pointer'
};

const td = {
  borderBottom: '1px solid #333',
  padding: '8px'
};