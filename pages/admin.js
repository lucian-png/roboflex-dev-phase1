import withRole from '../lib/withRole';
import Navbar from '../components/layout/Navbar';
import AdminPageComponent from '../components/AdminPage';

function AdminPageWrapper() {
  return (
    <>
      <Navbar />
      <AdminPageComponent />
    </>
  );
}

export default withRole(AdminPageWrapper, ['admin']);

  // ===== Highlight matching text =====
  const highlightMatch = (text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ backgroundColor: 'yellow', color: 'black', padding: 0 }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // ===== Cycle sort states =====
  const cycleSort = (config, setConfig, key) => {
    if (config.key === key) {
      if (config.direction === null) {
        setConfig({ key, direction: 'asc' });
      } else if (config.direction === 'asc') {
        setConfig({ key, direction: 'desc' });
      } else {
        setConfig({ key: null, direction: null }); // reset
      }
    } else {
      setConfig({ key, direction: 'asc' });
    }
  };

  // ===== Sort icon =====
  const getSortIcon = (config, key) => {
    if (config.key !== key || config.direction === null) {
      return <span style={{ color: '#aaa' }}> ↕</span>;
    }
    return (
      <span style={{ color: '#FFD700' }}>
        {config.direction === 'asc' ? ' ▲' : ' ▼'}
      </span>
    );
  };
  
    // ===== All Leads Table =====
  const combinedLeads = [
    ...submissions.map(r => ({
      source: 'Application',
      name: r.name,
      email: r.email,
      phone: r.phone,
      occupation: r.occupation,
      country: r.country,
      message: r.message,
      request: '',
      submitted_at: r.submitted_at
    })),
    ...conciergeRequests.map(r => ({
      source: 'Concierge',
      name: r.name,
      email: r.email,
      phone: '',
      occupation: '',
      country: '',
      message: '',
      request: r.request,
      submitted_at: r.submitted_at
    }))
  ];

  const [sortCombined, setSortCombined] = useState({ key: null, direction: null });
  const [searchCombined, setSearchCombined] = useState('');

  const sortedCombined = sortCombined.key
    ? [...combinedLeads].sort((a, b) => {
        if (a[sortCombined.key] < b[sortCombined.key]) return sortCombined.direction === 'asc' ? -1 : 1;
        if (a[sortCombined.key] > b[sortCombined.key]) return sortCombined.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [...combinedLeads].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const filteredCombined = sortedCombined.filter(row =>
    Object.values(row).some(val =>
      val && val.toString().toLowerCase().includes(searchCombined.toLowerCase())
    )
  );

  // ===== Applications Table =====
  const [sortApps, setSortApps] = useState({ key: null, direction: null });
  const [searchApps, setSearchApps] = useState('');

  const sortedApps = sortApps.key
    ? [...submissions].sort((a, b) => {
        if (a[sortApps.key] < b[sortApps.key]) return sortApps.direction === 'asc' ? -1 : 1;
        if (a[sortApps.key] > b[sortApps.key]) return sortApps.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [...submissions].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const filteredApps = sortedApps.filter(row =>
    Object.values(row).some(val =>
      val && val.toString().toLowerCase().includes(searchApps.toLowerCase())
    )
  );

  // ===== Concierge Table =====
  const [sortConc, setSortConc] = useState({ key: null, direction: null });
  const [searchConc, setSearchConc] = useState('');

  const sortedConc = sortConc.key
    ? [...conciergeRequests].sort((a, b) => {
        if (a[sortConc.key] < b[sortConc.key]) return sortConc.direction === 'asc' ? -1 : 1;
        if (a[sortConc.key] > b[sortConc.key]) return sortConc.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [...conciergeRequests].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const filteredConc = sortedConc.filter(row =>
    Object.values(row).some(val =>
      val && val.toString().toLowerCase().includes(searchConc.toLowerCase())
    )
  );
  
    // ===== Login =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
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

        const resConc = await fetch('/api/admin-get-concierge-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        const concData = await resConc.json();
        if (resConc.ok) setConciergeRequests(concData.requests);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Server error. Please try again.');
      setLoading(false);
    }
  };

  // ===== CSV Downloader =====
  const downloadCSV = async (url, filename) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
    } catch {
      alert('Error downloading CSV');
    }
  };

  // ===== UI Helpers =====
  const renderSearch = (value, setter) => (
    <div style={{ margin: '1rem 0', display: 'flex', gap: '0.5rem' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setter(e.target.value)}
        style={searchBox}
        placeholder="Search..."
      />
      {value && (
        <button onClick={() => setter('')} style={clearBtn}>
          ✕ Clear
        </button>
      )}
    </div>
  );

  const renderTable = (rows, highlightTerm, sortConfig, sortHandler, sortKeys) => (
    <table style={tableStyle}>
      <thead>
        <tr>
          {sortKeys.map((col) => (
            <th
              key={col}
              style={th}
              onClick={() => cycleSort(sortConfig, sortHandler, col)}
            >
              {col}
              {getSortIcon(sortConfig, col)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {sortKeys.map((col) => (
              <td key={col} style={td}>
                {highlightMatch(row[col], highlightTerm)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  
    if (!authed) {
    return (
      <div style={container}>
        <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: 'auto' }}>
          <h2>Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={input}
          />
          <button type="submit" style={button}>
            {loading ? 'Loading...' : 'Login'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={container}>
      {/* All Leads */}
      <h2>
        All Leads (Combined){' '}
        <button
          onClick={() => downloadCSV('/api/admin-export-combined', 'all_leads.csv')}
          style={btnRed}
        >
          Download Combined CSV
        </button>
      </h2>
      {renderSearch(searchCombined, setSearchCombined)}
      {renderTable(
        filteredCombined,
        searchCombined,
        sortCombined,
        setSortCombined,
        ['source','name','email','phone','occupation','country','message','request','submitted_at']
      )}

      {/* Applications */}
      <h2>
        Applications{' '}
        <button
          onClick={() => downloadCSV('/api/admin-export-csv', 'applications.csv')}
          style={btnBlue}
        >
          Download Applications CSV
        </button>
      </h2>
      {renderSearch(searchApps, setSearchApps)}
      {renderTable(
        filteredApps,
        searchApps,
        sortApps,
        setSortApps,
        ['name','email','phone','occupation','country','message','submitted_at']
      )}

      {/* Concierge */}
      <h2>
        Concierge Requests{' '}
        <button
          onClick={() => downloadCSV('/api/admin-export-concierge', 'concierge_requests.csv')}
          style={btnBlue}
        >
          Download Concierge CSV
        </button>
      </h2>
      {renderSearch(searchConc, setSearchConc)}
      {renderTable(
        filteredConc,
        searchConc,
        sortConc,
        setSortConc,
        ['name','email','request','submitted_at']
      )}
    </div>
  );
}

// ===== Styles =====
const container = { padding: '2rem', color: 'white', background: 'black', minHeight: '100vh' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' };
const th = { borderBottom: '1px solid #555', padding: '8px', background: '#111', cursor: 'pointer' };
const td = { borderBottom: '1px solid #333', padding: '8px' };
const input = { width: '100%', padding: '0.5rem', marginBottom: '1rem' };
const button = { width: '100%', padding: '0.75rem', fontWeight: 'bold' };
const btnBlue = { marginLeft: '1rem', padding: '0.5rem 1rem', background: '#003366', color: 'white', border: 'none', cursor: 'pointer' };
const btnRed = { marginLeft: '1rem', padding: '0.5rem 1rem', background: '#660000', color: 'white', border: 'none', cursor: 'pointer' };
const searchBox = { flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #555' };
const clearBtn = { padding: '0.5rem 1rem', background: '#444', color: 'white', border: 'none', cursor: 'pointer' };