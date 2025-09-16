import ConciergeForm from './ConciergeForm';

export default function OwnerContentSection() {
  return (
    <section style={{
      padding: '3rem 2rem',
      background: '#111',
      color: 'white'
    }}>
      <h3>Owner Resources</h3>
      <ul style={{ lineHeight: 1.8 }}>
        <li>📅 Concierge booking form</li>
        <li>📄 Download exclusive technical manuals (placeholder)</li>
        <li>📰 Private owner updates (placeholder)</li>
      </ul>

      <ConciergeForm /> {/* ✅ Form inside the owner portal */}
    </section>
  );
}