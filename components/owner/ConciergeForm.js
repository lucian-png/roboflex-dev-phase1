import { useState } from 'react';

export default function ConciergeForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/concierge-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', request: '' });
      } else {
        setError(data.error || 'Failed to send request');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ marginTop: '1rem', color: 'green' }}>
        ✅ Your concierge request has been submitted successfully!
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        background: '#000', 
        padding: '1.5rem', 
        color: 'white', 
        maxWidth: 500, 
        margin: '2rem auto', 
        borderRadius: '4px'
      }}
    >
      <h3>Concierge Request Form</h3>
      <label>
        Name:<br />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
      </label>

      <label>
        Email:<br />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
      </label>

      <label>
        Request Details:<br />
        <textarea
          name="request"
          rows="4"
          value={formData.request}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        ></textarea>
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button 
        type="submit"
        disabled={loading}
        style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {loading ? 'Sending...' : 'Submit Request'}
      </button>
    </form>
  );
}