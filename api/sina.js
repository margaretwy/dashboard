export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'missing symbols' });
  try {
    // 东方财富实时行情接口
    const secids = symbols; // 格式如 1.000300,0.000905
    const url = `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&invt=2&fields=f12,f14,f2,f3,f4&secids=${secids}&ut=bd1d9ddb04089700cf9c27f6f7426281`;
    const r = await fetch(url, {
      headers: {
        'Referer': 'https://www.eastmoney.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      }
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
