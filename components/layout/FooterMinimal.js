export default function FooterMinimal() {
  return (
    <footer style={{ padding: '1rem', background: 'black', color: 'white', marginTop: '2rem' }}>
      <p>© {new Date().getFullYear()} Roboflex. All rights reserved.</p>
    </footer>
  );
}