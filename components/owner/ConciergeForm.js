import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import theme from '../styles/theme';

export default function ConciergeForm() {
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Get logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('You must be logged in to submit a request.');
      setLoading(false);
      return;
    }

    // Insert concierge request tied to this user's Auth UUID
    const { error: insertError } = await supabase
      .from('concierge_requests')
      .insert([{
        id: user.id,                 // this is your linking column
        email: user.email,           // store email for reference
        request,                     // the request text
        submitted_at: new Date().toISOString() // optional if DB not already defaulting
      }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess('✅ Your concierge request has been submitted.');
      setRequest('');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label>Concierge Request</label>
      <textarea
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        required
        style={textareaStyle}
      />

      {error && <p style={{ color: theme.colors.error }}>{error}</p>}
      {success && <p style={{ color: 'lightgreen' }}>{success}</p>}

      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}

// ===== Themed Styles =====
const formStyle = {
  background: theme.colors.cardBackground,
  padding: theme.spacing.padding,
  borderRadius: theme.spacing.borderRadius,
  boxShadow: theme.shadows.card,
  marginBottom: '2rem' // space before the table
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