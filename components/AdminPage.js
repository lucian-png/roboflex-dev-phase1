import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminPageComponent() {
  const [submissions, setSubmissions] = useState([]);
  const [conciergeRequests, setConciergeRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // ===== Fetch & Subscribe =====
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      const { data: conc, error: concError } = await supabase
        .from('concierge_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (appsError || concError) {
        console.error(appsError || concError);
        setError('Error loading data.');
      } else {
        setSubmissions(apps);
        setConciergeRequests(conc);
      }

      setLoading(false);
    };

    fetchData();

    // Subscribe to changes in applications
    const applicationsChannel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => fetchData()
      )
      .subscribe();

    // Subscribe to changes in concierge_requests
    const conciergeChannel = supabase
      .channel('concierge-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'concierge_requests' },
        () => fetchData()
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(conciergeChannel);
    };
  }, []);

  // ===== Highlight matches =====
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
        setConfig({ key: null, direction: null });
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
    return <span style={{ color: '#FFD700' }}>{config.direction === 'asc' ? ' ▲' : ' ▼'}</span>;
  };

  // ===== Combined Leads =====
  const combinedLeads = [
    ...submissions.map(r => ({
      source: 'Application',
      ...r
    })),
    ...conciergeRequests.map(r => ({
      source: 'Concierge',
      ...r
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
    : [...combinedLeads];

  const filteredCombined = sortedCombined.filter(row =>
    Object.values(row).some(val =>
      val && val.toString().toLowerCase().includes(searchCombined.toLowerCase())
    )
  );

  // ===== Applications =====
  const [sortApps, setSortApps] = useState({ key: null, direction: null });
  const [searchApps, setSearchApps] = useState('');

  const sortedApps = sortApps.key
    ? [...submissions].sort((a, b) => {
        if (a[sortApps.key] < b[sortApps.key]) return sortApps.direction === 'asc' ? -1 : 1;
        if (a[sortApps.key] > b[sortApps.key]) return sortApps.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [...submissions];

  const filteredApps = sortedApps.filter(row =>
    Object.values(row).some(val =>
      val && val.toString().toLowerCase().includes(searchApps.toLowerCase())
    )
  );

  // ===== Concierge Requests =====
  const [sortConc, setSortConc] = useState({ key: null, direction: null });
  const [searchConc, setSearchConc] = useState('');

  const sortedConc = sortConc.key
    ? [...conciergeRequests].sort((a, b) => {
        if (a[sortConc.key] < b[sortConc.key]) return sortConc.direction === 'asc' ? -1 : 1;
        if (a[sortConc.key] > b[sortConc.key]) return sortConc.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [...conciergeRequests];

  const filteredConc = sortedConc.filter(row =>
    Object.values(row).some(val =>
      val && val.toString().toLowerCase().includes(searchConc.toLowerCase())
    )
  );

  // ===== CSV Downloader =====
  const downloadCSV = async (url, filename) => {
    try {
      const res = await fetch(url);
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
            <th key={col} style={th} onClick={() => cycleSort(sortConfig, sortHandler, col)}>
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

  if (loading) return <div style={container}>Loading data...</div>;
  if (error) return <div style={container}>{error}</div>;

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
        [
          'source',
          'name',
          'email',
          'phone',
          'occupation',
          'country',
          'message',
          'request',
          'submitted_at'
        ]
      )}

      {/* Applications */}
      <h2>
        Applications{' '}
        <button
          onClick={() =>
            downloadCSV('/api/admin-export-csv', 'applications.csv')
          }
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
        [
          'name',
          'email',
          'phone',
          'occupation',
          'country',
          'message',
          'submitted_at'
        ]
      )}

      {/* Concierge Requests */}
      <h2>
        Concierge Requests{' '}
        <button
          onClick={() =>
            downloadCSV('/api/admin-export-concierge', 'concierge_requests.csv')
          }
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
        ['name', 'email', 'request', 'submitted_at']
      )}
    </div>
  );
}

// ===== Styles =====
const container = {
  padding: '2rem',
  color: 'white',
  background: 'black',
  minHeight: '100vh'
};
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '2rem'
};
const th = {
  borderBottom: '1px solid #555',
  padding: '8px',
  background: '#111',
  cursor: 'pointer'
};
const td = { borderBottom: '1px solid #333', padding: '8px' };
const btnBlue = {
  marginLeft: '1rem',
  padding: '0.5rem 1rem',
  background: '#003366',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
};
const btnRed = {
  marginLeft: '1rem',
  padding: '0.5rem 1rem',
  background: '#660000',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
};
const searchBox = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #555'
};
const clearBtn = {
  padding: '0.5rem 1rem',
  background: '#444',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
};