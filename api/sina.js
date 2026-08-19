export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'missing symbols' });
  try {
    const url = `https://hq.sinajs.cn/list=${symbols}`;
    const r = await fetch(url, {
      headers: {
        'Referer': 'https://finance.sina.com.cn',
        'User-Agent': 'Mozilla/5.0',
      }
    });
    const buf = await r.arrayBuffer();
    const bytes = new Uint8Array(buf);
    // Convert GBK to string - extract only ASCII-safe numbers and separators
    let text = '';
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      if (b < 128) text += String.fromCharCode(b);
      else { text += '?'; if (b > 127) i++; } // skip GBK double-byte chars
    }
    const result = {};
    const lines = text.trim().split('\n');
    for (const line of lines) {
      const m = line.match(/var hq_str_(.+?)="(.*)"/);
      if (!m) continue;
      const sym = m[1];
      const parts = m[2].split(',');
      result[sym] = {
        price: parseFloat(parts[1]),
        chg: parseFloat(parts[2]),
        pct:
