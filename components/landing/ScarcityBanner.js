export default function ScarcityBanner() {
  const bannerStyle = {
    padding: '2rem',
    background: '#222',
    color: 'white',
    textAlign: 'center'
  };

  return (
    <section style={bannerStyle} id="apply">
      <strong>Unit #1 of 10 Now Available</strong>
      <p>
        Only 10 Limited Edition Original NASA‑Spec Units In The World — Apply Today.
      </p>
      <button
        style={{
          padding: '0.75rem 1.5rem',
          marginTop: '1rem',
          fontSize: '1rem'
        }}
      >
        Apply Now
      </button>
    </section>
  );
}