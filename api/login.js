export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const PASSWORD = '1801';
  const { password } = req.body;
  if (password === PASSWORD) {
    res.setHeader('Set-Cookie', `auth=${PASSWORD}; Path=/; HttpOnly; Max-Age=86400`);
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ error: 'wrong password' });
  }
}
