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
    const text = await r.text();
    const result = {};
    const lines = text.trim().split('\n');
    for (const line of lines) {
      const m = line.match(/var hq_str_(.+?)="(.*)"/);
      if (!m) continue;
      const sym = m[1];
      const parts = m[2].split(',');
      // s_sh format: name,price,change,pct,volume,amount
      // gb_ format: name,...,price(3),...
      const price = parseFloat(parts[1]);
      const chg = parseFloat(parts[2]);
      const pct = parseFloat(parts[3]);
      result[sym] = { price, chg, pct, parts };
    }
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
