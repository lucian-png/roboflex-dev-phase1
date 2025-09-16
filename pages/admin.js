import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [conciergeRequests, setConciergeRequests] = useState([]); // ✅ NEW

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

    try {
      // Fetch applications
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

        // ✅ Fetch concierge requests
        const resConcierge = await fetch('/api/admin-get-concierge-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        const conciergeData = await resConcierge.json();
        if (resConcierge.ok) {
          setConciergeRequests(conciergeData.requests);
        } else {
          console.error('Error fetching concierge requests:', conciergeData.error);
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again.');
      setLoading(false);
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

  const downloadConciergeCSV = async () => {
    try {
      const res = await fetch('/api/admin-export-concierge', {
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
      link.setAttribute('download', 'concierge_requests.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Error downloading Concierge Requests CSV');
      console.error(err);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
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
      {/* Applications Section */}
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
            <th style={th} onClick={() => handleSort('name')}>Name{getSortIcon('name')}</th>
            <th style={th} onClick={() => handleSort('email')}>Email{getSortIcon('email')}</th>
            <th style={th} onClick={() => handleSort('phone')}>Phone{getSortIcon('phone')}</th>
            <th style={th} onClick={() => handleSort('occupation')}>Occupation{getSortIcon('occupation')}</th>
            <th style={th} onClick={() => handleSort('country')}>Country{getSortIcon('country')}</th>
            <th style={th} onClick={() => handleSort('message')}>Message{getSortIcon('message')}</th>
            <th style={th} onClick={() => handleSort('submitted_at')}>Submitted At{getSortIcon('submitted_at')}</th>
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

      {/* Concierge Requests Section */}
        <h2 style={{ marginTop: '3rem' }}>
          Concierge Requests{' '}
          <button
            onClick={downloadConciergeCSV}
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
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Request</th>
            <th style={th}>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {conciergeRequests.map((row) => (
            <tr key={row.id}>
              <td style={td}>{row.name}</td>
              <td style={td}>{row.email}</td>
              <td style={td}>{row.request}</td>
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