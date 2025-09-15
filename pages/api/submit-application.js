import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  console.log("Incoming request body:", req.body);
  console.log("=== API ROUTE CALLED ===");
  console.log("HTTP Method:", req.method);
  console.log("Supabase URL:", process.env.SUPABASE_URL);
  console.log("Service Role key length:", process.env.SUPABASE_SERVICE_ROLE?.length);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, occupation, country, message } = req.body;

  // ✅ Server-side validation: all fields required
  if (!name || !email || !phone || !occupation || !country || !message) {
    console.log("Validation failed — missing fields");
    return res.status(400).json({ error: 'All fields are required' });
  }

  const { data, error } = await supabase
    .from('applications')
    .insert([
      { name, email, phone, occupation, country, message }
    ])
    .select();

  console.log("Insert result:", { data, error });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Application submitted', data });
}