export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'missing symbol' });
  try {
    const url = `https://stooq.com/q/l/?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/csv,text/plain,*/*',
        'Referer': 'https://stooq.com',
      }
    });
    const text = await r.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) return res.status(404).json({ error: 'no data', raw: text });
    const headers = lines[0].split(',');
    const values = lines[1].split(',');
    const row = {};
    headers.forEach((h, i) => row[h.trim()] = values[i]?.trim());
    res.status(200).json({
      symbol: row['Symbol'] || symbol,
      date: row['Date'],
      time: row['Time'],
      open: parseFloat(row['Open']),
      high: parseFloat(row['High']),
      low: parseFloat(row['Low']),
      close: parseFloat(row['Close']),
      volume: parseFloat(row['Volume']),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
