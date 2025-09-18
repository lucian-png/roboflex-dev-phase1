import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE // Service role to bypass RLS for writing
);

export default async function handler(req, res) {
  console.log("=== API ROUTE CALLED ===");
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, occupation, country, message, access_token } = req.body;

  // Validation
  if (!name || !email || !phone || !occupation || !country || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Get the user making the request
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);

  if (userError || !user) {
    console.error("Auth error:", userError);
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Insert with FK user_id
  const { data, error } = await supabase
    .from('applications')
    .insert([{
      user_id: user.id, // FK to auth.users
      name,
      email,
      phone,
      occupation,
      country,
      message
    }])
    .select();

  if (error) {
    console.error("Insert error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Application submitted', data });
}