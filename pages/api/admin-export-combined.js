import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch Applications
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('*');

    if (appError) throw appError;

    // Fetch Concierge Requests
    const { data: concierge, error: concError } = await supabase
      .from('concierge_requests')
      .select('*');

    if (concError) throw concError;

    // Map Applications to unified format
    const appRows = applications.map(row => ({
      source: 'Application',
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      occupation: row.occupation || '',
      country: row.country || '',
      message: row.message || '',
      request: '',
      submitted_at: row.submitted_at || ''
    }));

    // Map Concierge Requests to unified format
    const concRows = concierge.map(row => ({
      source: 'Concierge',
      name: row.name || '',
      email: row.email || '',
      phone: '',
      occupation: '',
      country: '',
      message: '',
      request: row.request || '',
      submitted_at: row.submitted_at || ''
    }));

    // Merge & sort by submitted_at (descending: newest first)
    const allRows = [...appRows, ...concRows].sort((a, b) => {
      return new Date(b.submitted_at) - new Date(a.submitted_at);
    });

    // CSV Header
    const header = [
      'Source',
      'Name',
      'Email',
      'Phone',
      'Occupation',
      'Country',
      'Message',
      'Request',
      'Submitted At'
    ];

    const csvContent = [
      header,
      ...allRows.map(row => [
        row.source,
        row.name,
        row.email,
        row.phone,
        row.occupation,
        row.country,
        row.message,
        row.request,
        row.submitted_at
      ])
    ]
      .map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv;charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="all_leads.csv"');
    res.status(200).send(csvContent);

  } catch (err) {
    console.error('Combined export error:', err);
    res.status(500).json({ error: 'Failed to generate combined CSV' });
  }
}
