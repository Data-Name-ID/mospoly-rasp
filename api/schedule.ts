// Vercel Serverless Function — CORS proxy for rasp.dmami.ru
// Deploy to Vercel and this function will handle /api/schedule requests

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { group, session = '0' } = req.query;

  if (!group || typeof group !== 'string') {
    return res.status(400).json({ error: 'Missing "group" query parameter' });
  }

  const url = `https://rasp.dmami.ru/site/group?group=${encodeURIComponent(group)}&session=${encodeURIComponent(String(session))}`;

  try {
    const response = await fetch(url, {
      headers: {
        Referer: 'https://rasp.dmami.ru/',
        'User-Agent': 'MospolyRasp/1.0',
      },
    });

    const data = await response.json();

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch schedule' });
  }
}
