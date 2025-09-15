export default function SocialProofCarousel() {
  const sectionStyle = {
    padding: '4rem 2rem',
    background: '#000',
    color: 'white',
    textAlign: 'center'
  };

  // Placeholder testimonial list
  const testimonials = [
    `"An unmatched performance experience." — Private Client`,
    `"The craftsmanship is beyond compare." — Collector`,
    `"Roboflex is decades ahead of its time." — Industry Insider`
  ];

  return (
    <section style={sectionStyle}>
      <h3>Testimonials</h3>
      {testimonials.map((quote, i) => (
        <p key={i} style={{ marginTop: '1rem', fontStyle: 'italic' }}>
          {quote}
        </p>
      ))}
    </section>
  );
}