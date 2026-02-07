// Vercel Serverless Function — CORS proxy for rasp.dmami.ru

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { group, session = '0' } = req.query;

  if (!group || typeof group !== 'string') {
    return res.status(400).json({ error: 'Missing "group" query parameter' });
  }

  const url = `https://rasp.dmami.ru/site/group?group=${encodeURIComponent(group)}&session=${encodeURIComponent(String(session))}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      headers: {
        Referer: 'https://rasp.dmami.ru/',
        'User-Agent': 'MospolyRasp/1.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();

    // Cache 5 min, serve stale up to 24h while revalidating
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);

    // Even on failure, allow Vercel edge to serve stale cache if available
    res.setHeader('Cache-Control', 'stale-if-error=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(502).json({ error: 'Upstream API unavailable' });
  }
}
