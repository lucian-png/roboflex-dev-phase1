import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import theme from '../styles/theme';
import ConciergeRequestForm from './owner/ConciergeForm';

export default function OwnerPageComponent() {
  const [myRequests, setMyRequests] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('concierge');

  // Search states
  const [conciergeSearch, setConciergeSearch] = useState('');
  const [applicationsSearch, setApplicationsSearch] = useState('');

  // Mount guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const savedTab = localStorage.getItem('ownerDashboardActiveTab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('ownerDashboardActiveTab', tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No logged-in user found.');
        setLoading(false);
        return;
      }

      // Concierge requests
      const { data: conciergeData } = await supabase
        .from('concierge_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
      setMyRequests(conciergeData || []);

      // Applications
      const { data: appData } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
      setMyApplications(appData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  const downloadCSV = (rows, fileName, columns) => {
    const csvHeader = columns.join(',') + '\n';
    const csvRows = rows.map(row =>
      columns.map(col => `"${row[col] || ''}"`).join(',')
    );
    const blob = new Blob([csvHeader + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filter rows based on query
  const filterRows = (rows, query) =>
    rows.filter(row =>
      Object.values(row).some(val =>
        String(val || '').toLowerCase().includes(query.toLowerCase())
      )
    );

  const filteredConcierge = filterRows(myRequests, conciergeSearch);
  const filteredApplications = filterRows(myApplications, applicationsSearch);

  if (!mounted) return null;
  if (loading) return <div style={{ padding: theme.spacing.padding }}>Loading...</div>;

  return (
    <div>
      {/* Tabs */}
      <div style={tabNavStyle}>
        <button style={activeTab === 'concierge' ? tabActiveStyle : tabStyle} onClick={() => handleTabChange('concierge')}>
          Concierge Requests
        </button>
        <button style={activeTab === 'applications' ? tabActiveStyle : tabStyle} onClick={() => handleTabChange('applications')}>
          Applications
        </button>
      </div>

      {/* Concierge Tab */}
      {activeTab === 'concierge' && (
        <>
          <Section title="Submit a Concierge Request">
            <ConciergeRequestForm
              onSuccess={(newRequest) => setMyRequests(prev => [newRequest, ...prev])}
            />
            <div style={{ marginTop: '1rem' }}>
              <DownloadButton
                label="Download My Concierge Requests (CSV)"
                onClick={() =>
                  downloadCSV(filteredConcierge, 'my_concierge_requests.csv',
                    ['name','email','request','submitted_at'])
                }
              />
            </div>
          </Section>

          <Section title="My Concierge Requests">
            <SearchBox value={conciergeSearch} onChange={setConciergeSearch} />
            <DownloadButton
              onClick={() =>
                downloadCSV(filteredConcierge, 'my_concierge_requests.csv',
                  ['name','email','request','submitted_at'])
              }
            />
            <DataTable
              columns={['name','email','request','submitted_at']}
              rows={filteredConcierge}
              defaultSortKey="submitted_at"
              defaultSortDirection="desc"
            />
          </Section>
        </>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <Section title="My Applications">
          <SearchBox value={applicationsSearch} onChange={setApplicationsSearch} />
          <DownloadButton
            label="Download My Applications (CSV)"
            onClick={() =>
              downloadCSV(filteredApplications, 'my_applications.csv',
                ['name','email','phone','occupation','country','message','submitted_at'])
            }
          />
          <DataTable
            columns={['name','email','phone','occupation','country','message','submitted_at']}
            rows={filteredApplications}
            defaultSortKey="submitted_at"
            defaultSortDirection="desc"
          />
        </Section>
      )}
    </div>
  );
}

/* ----- Helpers ----- */
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h3 style={{
        fontSize: theme.typography.textSize,
        marginBottom: '0.75rem',
        borderBottom: `2px solid ${theme.colors.primary}`,
        paddingBottom: '0.25rem'
      }}>{title}</h3>
      {children}
    </section>
  );
}

function DownloadButton({ onClick, label }) {
  return <button onClick={onClick} style={downloadBtnStyle}>⬇ {label || 'Download CSV'}</button>;
}

function SearchBox({ value, onChange }) {
  return (
    <div style={searchWrapperStyle}>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={searchInputStyle}
      />
      {value && <button onClick={() => onChange('')} style={clearBtnStyle}>✕</button>}
    </div>
  );
}

/* ----- DataTable with Gold Arrows ----- */
function DataTable({ columns, rows, defaultSortKey = null, defaultSortDirection = null }) {
  const [sortConfig, setSortConfig] = useState({ key: defaultSortKey, direction: defaultSortDirection });

  const cycleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === null) return { key, direction: 'asc' };
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return { key: null, direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key || !sortConfig.direction) {
      return <span style={{ color: '#aaa' }}>↕</span>;
    }
    return sortConfig.direction === 'asc'
      ? <span style={{ color: '#FFD700' }}>▲</span>
      : <span style={{ color: '#FFD700' }}>▼</span>;
  };

  const sortedRows = sortConfig.key
    ? [...rows].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : rows;

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col} style={{ ...thStyle, cursor: 'pointer' }} onClick={() => cycleSort(col)}>
              {col} {getSortIcon(col)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.length > 0 ? (
          sortedRows.map((row, idx) => (
            <tr key={idx}>
              {columns.map(col => (
                <td key={col} style={tdStyle}>
                  {String(row[col] || '')}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} style={{ ...tdStyle, textAlign: 'center', color: theme.colors.textLight }}>
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

/* ----- Styles ----- */
const searchWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '1rem', width: '100%' };
const searchInputStyle = { padding: '0.5rem', border: `1px solid ${theme.colors.border}`, borderRadius: '4px', width: '100%', background: theme.colors.inputBackground, color: theme.colors.text };
const clearBtnStyle = { position: 'absolute', right: '8px', background: 'transparent', border: 'none', color: theme.colors.textLight, fontSize: '1rem', cursor: 'pointer' };
const downloadBtnStyle = { marginBottom: '1rem', background: theme.colors.primary, color: theme.colors.text, border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: theme.spacing.borderRadius };
const tableStyle = { width: '100%', borderCollapse: 'collapse', background: theme.colors.cardBackground, boxShadow: theme.shadows.card, borderRadius: theme.spacing.borderRadius, overflow: 'hidden' };
const thStyle = { borderBottom: `1px solid ${theme.colors.border}`, padding: '0.75rem', background: theme.colors.inputBackground, textAlign: 'left', fontWeight: 'bold', color: theme.colors.text };
const tdStyle = { borderBottom: `1px solid ${theme.colors.border}`, padding: '0.75rem', color: theme.colors.text };
const tabNavStyle = { display: 'flex', marginBottom: '1rem', borderBottom: `2px solid ${theme.colors.border}` };
const tabStyle = { flex: 1, padding: '0.75rem', background: 'transparent', color: theme.colors.text, border: 'none', borderBottom: `3px solid transparent`, cursor: 'pointer', fontWeight: 'bold' };
const tabActiveStyle = { ...tabStyle, borderBottom: `3px solid ${theme.colors.primary}` };