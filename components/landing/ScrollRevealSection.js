export default function ScrollRevealSection() {
  const sectionStyle = {
    padding: '4rem 2rem',
    background: '#111',
    color: 'white',
    textAlign: 'center'
  };

  return (
    <section style={sectionStyle}>
      <h3>Heritage & Technology</h3>
      <p>
        A teaser for the heritage and technical details of Roboflex. In the final
        version, this will animate into view as the user scrolls.
      </p>
    </section>
  );
}