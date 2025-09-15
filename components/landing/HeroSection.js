export default function HeroSection() {
  const heroStyle = {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#000',
    color: 'white',
    textAlign: 'center',
    padding: '2rem'
  };

  return (
    <section style={heroStyle}>
      <h1>Roboflex</h1>
      <h2>Ultra‑Luxury Human Performance System</h2>
      <button
        style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          cursor: 'pointer'
        }}
        onClick={() => {
          const el = document.getElementById('apply');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Request Private Access
      </button>
    </section>
  );
}