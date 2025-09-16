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
      .select('*')
      .order('submitted_at', { ascending: false });

    if (appError) throw appError;

    // Fetch Concierge Requests
    const { data: concierge, error: concError } = await supabase
      .from('concierge_requests')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (concError) throw concError;

    // CSV Header (consistent across both types)
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

    // Format Application rows
    const appRows = applications.map(row => [
      'Application',
      row.name || '',
      row.email || '',
      row.phone || '',
      row.occupation || '',
      row.country || '',
      row.message || '',
      '', // Request is concierge-only
      row.submitted_at || ''
    ]);

    // Format Concierge rows
    const concRows = concierge.map(row => [
      'Concierge',
      row.name || '',
      row.email || '',
      '', // Phone not in concierge form
      '', // Occupation not in concierge form
      '', // Country not in concierge form
      '', // Message not in concierge form
      row.request || '',
      row.submitted_at || ''
    ]);

    const allRows = [...appRows, ...concRows];

    const csvContent = [header, ...allRows]
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
