import SEO from '../components/SEO';
import styles from '../styles/Home.module.css';

export default function TechnologyPrinciples() {
  const seoUrl = 'https://roboflex.co/technology-principles';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Roboflex',
    url: 'https://roboflex.co',
    logo: 'https://roboflex.co/logo.png', // Make sure logo.png is in /public
    sameAs: [
      'https://www.linkedin.com/company/roboflex', // Update if available
      'https://twitter.com/roboflex_official'       // Update if available
    ]
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Roboflex Human Performance System',
    image: 'https://roboflex.co/og-image-tech.jpg',
    description:
      'Explore the core engineering principles behind Roboflex — a NASA‑heritage, biolocomotion performance system for elite physical mastery.',
    brand: {
      '@type': 'Brand',
      name: 'Roboflex'
    },
    offers: {
      '@type': 'Offer',
      url: 'https://roboflex.co/apply',
      priceCurrency: 'USD',
      availability: 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Technology Principles — Roboflex',
    url: seoUrl,
    description:
      'Discover the core engineering principles behind the Roboflex biolocomotion system — a NASA‑heritage, aerospace‑grade performance platform.'
  };

  return (
    <>
      <SEO
        pageKey="technologyPrinciples"
        title="Roboflex Technology Principles — Biolocomotion Performance"
        description="Explore the core engineering principles behind Roboflex — a NASA‑heritage, biolocomotion performance system for elite physical mastery."
        url={seoUrl}
        image="/og-image-tech.jpg"
      />

      {/* Embedded JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema)
        }}
      />

      {/* Page Content */}
      <div className={styles.section}>
        <h1>Technology Principles</h1>
        <h2>Engineering the Human Machine for Longevity, Precision, and Power</h2>
      </div>

      <section className={styles.section}>
        <h3>Aligned With Nature</h3>
        <p>
          Roboflex harnesses the body’s natural biolocomotion system — the mechanical,
          neurological, and muscular alignment perfected by millions of years of
          evolution. By matching resistance perfectly to these force vectors, our
          technology enables unprecedented performance gains without destructive overload.
        </p>
      </section>

      <section className={styles.section}>
        <h3>From NASA Heritage to the Pentagon to Private Ownership</h3>
        <p>
          Crafted with aerospace‑grade alloys and precision components. Originally
          engineered for astronauts and high‑G military pilots. Exclusive limited
          availability — only 10 original NASA‑spec units in existence.
        </p>
      </section>

      <section className={styles.section}>
        <h3>Strength That Endures</h3>
        <p>
          Engineered for long‑term structural integrity. Builds physical resilience while
          preserving joint health. Applications for elite sport, tactical performance, and
          life extension.
        </p>
      </section>

      <section className={styles.section}>
        <h3>Learn More or Apply for Access</h3>
        <a href="/apply">
          <button>Apply for Access</button>
        </a>
      </section>
    </>
  );
}