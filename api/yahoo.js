export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol, range, interval } = req.query;
  if (!symbol) return res.status(400).json({ error: 'missing symbol' });
  try {
    const iv = interval || '1d';
    const rng = range || '5d';
    // Try v8 first, fallback to v7
    const urls = [
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${iv}&range=${rng}`,
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${iv}&range=${rng}`,
    ];
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://finance.yahoo.com',
      'Origin': 'https://finance.yahoo.com',
    };
    let data = null;
    for (const url of urls) {
      try {
        const r = await fetch(url, { headers });
        if (r.ok) { data = await r.json(); break; }
      } catch {}
    }
    if (!data) return res.status(502).json({ error: 'upstream failed' });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
