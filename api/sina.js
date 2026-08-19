export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'missing symbols' });
  try {
    const url = `https://hq.sinajs.cn/list=${symbols}`;
    const r = await fetch(url, {
      headers: {
        'Referer': 'https://finance.sina.com.cn',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      }
    });
    const status = r.status;
    const text = await r.text();
    res.status(200).json({ status, raw: text.slice(0, 500) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
