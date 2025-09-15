export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, contentKey } = req.body;

  if (!password || !contentKey) {
    return res.status(400).json({ error: 'Password and content key are required' });
  }

  // Use ENV variable naming convention: {KEY}_PAGE_PASSWORD
  const envVarName = `${contentKey.toUpperCase()}_PAGE_PASSWORD`;
  const expectedPassword = process.env[envVarName];

  if (!expectedPassword) {
    return res.status(400).json({ error: 'Invalid content key' });
  }

  if (password === expectedPassword) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  }
}