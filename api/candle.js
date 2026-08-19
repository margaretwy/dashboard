export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol, from, to, resolution } = req.query;
  if (!symbol) return res.status(400).json({ error: 'missing symbol' });
  const KEY = 'da2fan9r01qmq2q9olq0da2fan9r01qmq2q9olqg';
  const r2 = resolution || 'D';
  try {
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${r2}&from=${from}&to=${to}&token=${KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
