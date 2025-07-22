
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: 'Missing title parameter' });

  const response = {};

  // AniList query
  try {
    const query = `{ Media(search: "${title}", type: MANGA) { averageScore } }`;
    const aniRes = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const aniJson = await aniRes.json();
    response.ani = aniJson.data?.Media?.averageScore || null;
  } catch {
    response.ani = null;
  }

  // MAL via Jikan API
  try {
    const malRes = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(title)}&limit=1`);
    const malJson = await malRes.json();
    response.mal = malJson.data?.[0]?.score || null;
  } catch {
    response.mal = null;
  }

  res.json(response);
}
