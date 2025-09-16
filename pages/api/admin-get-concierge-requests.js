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
    const { data, error } = await supabase
      .from('concierge_requests')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ requests: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load concierge requests' });
  }
}