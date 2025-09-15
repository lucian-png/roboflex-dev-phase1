import Link from 'next/link';

export default function ScarcityBanner() {
  const bannerStyle = {
    padding: '2rem',
    background: '#222',
    color: 'white',
    textAlign: 'center'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    marginTop: '1rem',
    fontSize: '1rem',
    cursor: 'pointer'
  };

  return (
    <section style={bannerStyle}>
      <strong>Unit #1 of 10 Now Available</strong>
      <p>
        Only 10 Limited Edition Original NASA‑Spec Units In The World — Apply Today.
      </p>
      <Link href="/apply">
        <button style={buttonStyle}>Apply Now</button>
      </Link>
    </section>
  );
}