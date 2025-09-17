import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import theme from '../styles/theme';

export default function OwnerPageComponent() {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const [highlightedId, setHighlightedId] = useState(null);

  // Load logged-in user's concierge requests
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('No logged-in user found.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('concierge_requests')
        .select('*')
        .eq('id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setMyRequests(data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleNewRequest = (newRequest) => {
    setMyRequests(prev => [newRequest, ...prev]);
    setHighlightedId(newRequest.submitted_at); // use unique timestamp as identifier

    // Auto-scroll to table
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightedId(null);
    }, 3000);
  };

  return (
    <div>
      {/* Submission Form */}
      <Section title="Submit a Concierge Request">
        <ConciergeRequestForm onSuccess={handleNewRequest} />
      </Section>

      {/* My Requests Table */}
      <Section title="My Concierge Requests">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div ref={tableRef}>
            <DataTable
              columns={['name', 'email', 'request', 'submitted_at']}
              rows={myRequests}
              highlightedId={highlightedId}
            />
          </div>
        )}
      </Section>
    </div>
  );
}

// ===== Concierge Request Form =====
function ConciergeRequestForm({ onSuccess }) {
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const CHAR_LIMIT = 500;

  const textareaRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!request.trim()) {
      setError('Please enter a concierge request.');
      setLoading(false);
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (request.length > CHAR_LIMIT) {
      setError(`Request must be ${CHAR_LIMIT} characters or fewer.`);
      setLoading(false);
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('You must be logged in to submit a request.');
      setLoading(false);
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const newRecord = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      request,
      submitted_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('concierge_requests')
      .insert([newRecord]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess('✅ Your concierge request has been submitted.');
      setRequest('');
      onSuccess && onSuccess(newRecord);
    }

    setLoading(false);
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label>Concierge Request</label>
      <textarea
        ref={textareaRef}
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        maxLength={CHAR_LIMIT}
        required
        style={textareaStyle}
      />

      <p style={{
        fontSize: theme.typography.smallTextSize,
        textAlign: 'right',
        margin: '-0.5rem 0 1rem',
        color: request.length > CHAR_LIMIT ? theme.colors.error : theme.colors.textLight
      }}>
        {request.length}/{CHAR_LIMIT} characters
      </p>

      <div ref={feedbackRef}>
        {error && <p style={{ color: theme.colors.error }}>{error}</p>}
        {success && <p style={{ color: 'lightgreen' }}>{success}</p>}
      </div>

      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}

// ===== Section Wrapper =====
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h3 style={{
        fontSize: theme.typography.textSize,
        marginBottom: '0.75rem',
        borderBottom: `2px solid ${theme.colors.primary}`,
        paddingBottom: '0.25rem'
      }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

// ===== Data Table =====
function DataTable({ columns, rows, highlightedId }) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col} style={thStyle}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, idx) => {
            const isHighlighted = highlightedId && row.submitted_at === highlightedId;
            return (
              <tr
                key={idx}
                style={{
                  background: isHighlighted ? 'rgba(0, 128, 255, 0.2)' : 'transparent',
                  transition: 'background 1s ease'
                }}
              >
                {columns.map(col => (
                  <td key={col} style={tdStyle}>
                    {formatCell(row[col])}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={columns.length} style={{ ...tdStyle, textAlign: 'center', color: theme.colors.textLight }}>
              No concierge requests yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function formatCell(value) {
  if (!value) return '';
  if (typeof value === 'string' && Date.parse(value) && value.includes('T')) {
    return new Date(value).toLocaleString();
  }
  return value;
}

// ===== Styles =====
const formStyle = {
  background: theme.colors.cardBackground,
  padding: theme.spacing.padding,
  borderRadius: theme.spacing.borderRadius,
  boxShadow: theme.shadows.card,
  marginBottom: '1.5rem'
};

const textareaStyle = {
  width: '100%',
  minHeight: '100px',
  marginBottom: '1rem',
  borderRadius: '4px',
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.inputBackground,
  color: theme.colors.text,
  padding: '0.5rem',
  fontFamily: 'inherit',
  fontSize: theme.typography.textSize
};

const buttonStyle = {
  background: theme.colors.primary,
  color: theme.colors.text,
  border: 'none',
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  borderRadius: '4px'
};

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