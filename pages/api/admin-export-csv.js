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

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching data' });
  }

  // ✅ Updated CSV header to include all new fields
  const header = ['Name', 'Email', 'Phone', 'Occupation', 'Country', 'Message', 'Submitted At'];

  const rows = data.map(row => [
    row.name || '',
    row.email || '',
    row.phone || '',
    row.occupation || '',
    row.country || '',
    row.message || '',
    row.submitted_at || ''
  ]);

  const csvContent = [header, ...rows]
    .map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  res.setHeader('Content-Type', 'text/csv;charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
  res.status(200).send(csvContent);
}
