export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { series, start, limit } = req.query;
  if (!series) return res.status(400).json({ error: 'missing series' });
  const KEY = '9226f0d1af2b3eeb79310adeeb4a92ba';
  try {
    let url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${KEY}&sort_order=desc&file_type=json`;
    if (limit) url += `&limit=${limit}`;
    if (start) url += `&observation_start=${start}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
