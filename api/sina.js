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
        'Accept-Charset': 'utf-8',
      }
    });
    const buf = await r.arrayBuffer();
    const text = new TextDecoder('gbk').decode(buf);
    // Parse into JSON
    const result = {};
    const lines = text.trim().split('\n');
    for (const line of lines) {
      const m = line.match(/var hq_str_(.+?)="(.*)"/);
      if (!m) continue;
      const sym = m[1];
      const parts = m[2].split(',');
      result[sym] = {
        name: parts[0],
        price: parseFloat(parts[1]) || parseFloat(parts[3]),
        close: parseFloat(parts[2]) || parseFloat(parts[4]),
        chg: parseFloat(parts[3]) || 0,
        pct: parseFloat(parts[4]) || 0,
        raw: parts
      };
    }
    res.status(200).json(result);
  } catch
    
