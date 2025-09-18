import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient'; // ✅ Needed to get session

export default function ApplicationForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occupation: '',
    country: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // 🎯 Get the logged-in user's access token
      const { data: { session } } = await supabase.auth.getSession();
      const access_token = session?.access_token;

      if (!access_token) {
        setError('You must be logged in to submit.');
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, access_token })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          occupation: '',
          country: '',
          message: ''
        });

        // OPTIONAL auto-redirect
        // setTimeout(() => router.push('/thank-you'), 1500);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('❌ Submit error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null; // prevent hydration errors

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label>Full Name:<br />
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>Email:<br />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>Phone:<br />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </label>
          </>
        );
      case 2:
        return (
          <>
            <label>Occupation:<br />
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required />
            </label>
            <label>Country:<br />
              <input type="text" name="country" value={formData.country} onChange={handleChange} required />
            </label>
          </>
        );
      case 3:
        return (
          <>
            <label>Your Message:<br />
              <textarea name="message" rows="4" value={formData.message} onChange={handleChange} required />
            </label>
          </>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <div style={{ marginTop: '2rem', color: 'green' }}>
        ✅ Application submitted successfully!<br />
        We will contact you if you qualify.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '400px',
      marginTop: '2rem',
      gap: '1rem'
    }}>
      {renderStep()}

      {error && <div style={{ color: 'red' }}>❌ {error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {step > 1 && (
          <button type="button" onClick={() => setStep((prev) => prev - 1)} disabled={isSubmitting}>Back</button>
        )}
        {step < 3 && (
          <button type="button" onClick={() => setStep((prev) => prev + 1)} disabled={isSubmitting}>Next</button>
        )}
        {step === 3 && (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </form>
  );
}