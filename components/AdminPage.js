import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import theme from '../styles/theme';

export default function AdminPageComponent() {
  const [submissions, setSubmissions] = useState([]);
  const [conciergeRequests, setConciergeRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (appsError) console.error(appsError);
      else setSubmissions(apps || []);

      // Fetch concierge requests
      const { data: concierge, error: conciergeError } = await supabase
        .from('concierge_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (conciergeError) console.error(conciergeError);
      else setConciergeRequests(concierge || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: theme.spacing.padding }}>Loading...</div>;
  }

  // Combine both
  const combinedLeads = [
    ...(submissions || []).map(r => ({
      source: 'Application',
      ...r
    })),
    ...(conciergeRequests || []).map(r => ({
      source: 'Concierge',
      ...r
    }))
  ];

  return (
    <div>
      {/* Combined Table */}
      <Section title="All Leads (Combined)">
        <DataTable
          columns={[
            'source',
            'name',
            'email',
            'phone',
            'occupation',
            'country',
            'message',
            'request',
            'submitted_at'
          ]}
          rows={combinedLeads}
          defaultSortKey="submitted_at"
          defaultSortDirection="desc"
        />
      </Section>

      {/* Applications Table */}
      <Section title="Applications">
        <DataTable
          columns={[
            'name',
            'email',
            'phone',
            'occupation',
            'country',
            'message',
            'submitted_at'
          ]}
          rows={submissions}
          defaultSortKey="submitted_at"
          defaultSortDirection="desc"
        />
      </Section>

      {/* Concierge Requests Table */}
      <Section title="Concierge Requests">
        <DataTable
          columns={['name', 'email', 'request', 'submitted_at']}
          rows={conciergeRequests}
          defaultSortKey="submitted_at"
          defaultSortDirection="desc"
        />
      </Section>
    </div>
  );
}

// ===== Reusable Section Component =====
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h3
        style={{
          fontSize: theme.typography.textSize,
          marginBottom: '0.75rem',
          borderBottom: `2px solid ${theme.colors.primary}`,
          paddingBottom: '0.25rem'
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

// ===== Reusable DataTable Component with Sorting =====
function DataTable({ columns, rows, defaultSortKey = null, defaultSortDirection = null }) {
  const [sortConfig, setSortConfig] = useState({
    key: defaultSortKey,
    direction: defaultSortDirection
  });

  const cycleSort = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === null) {
        setSortConfig({ key, direction: 'asc' });
      } else if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' });
      } else {
        setSortConfig({ key: null, direction: null });
      }
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key || sortConfig.direction === null) {
      return <span style={{ color: '#aaa' }}> ↕</span>;
    }
    return sortConfig.direction === 'asc'
      ? <span style={{ color: '#FFD700' }}> ▲</span>
      : <span style={{ color: '#FFD700' }}> ▼</span>;
  };

  const sortedRows = sortConfig.key
    ? [...rows].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : rows;

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              style={{ ...thStyle, cursor: 'pointer' }}
              onClick={() => cycleSort(col)}
            >
              {col} {getSortIcon(col)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.length > 0 ? (
          sortedRows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col} style={tdStyle}>
                  {formatCell(row[col])}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              style={{
                ...tdStyle,
                textAlign: 'center',
                color: theme.colors.textLight
              }}
            >
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// ===== Helpers =====
function formatCell(value) {
  if (!value) return '';
  if (typeof value === 'string' && Date.parse(value) && value.includes('T')) {
    return new Date(value).toLocaleString();
  }
  return value;
}

// ===== Themed Styles =====
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: theme.colors.cardBackground,
  boxShadow: theme.shadows.card,
  borderRadius: theme.spacing.borderRadius,
  overflow: 'hidden'
};

const thStyle = {
  borderBottom: `1px solid ${theme.colors.border}`,
  padding: '0.75rem',
  background: theme.colors.inputBackground,
  textAlign: 'left',
  fontWeight: 'bold',
  color: theme.colors.text
};

const tdStyle = {
  borderBottom: `1px solid ${theme.colors.border}`,
  padding: '0.75rem',
  color: theme.colors.text
};