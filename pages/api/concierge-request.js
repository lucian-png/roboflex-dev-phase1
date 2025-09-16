import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE // NOTE: This must stay server-side only
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, request } = req.body;

  if (!name || !email || !request) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { data, error } = await supabase
      .from('concierge_requests')
      .insert([{ name, email, request }])
      .select();

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Supabase insert error:', err);
    return res.status(500).json({ error: 'Failed to save request' });
  }
}