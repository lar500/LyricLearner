import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, artist } = req.body;

    if (!title || !artist) {
        return res.status(400).json({ error: 'Song title and artist name are required' });
    }

    if (!process.env.GENIUS_API_KEY) {
        return res.status(500).json({ error: 'API key configuration error' });
    }

    try {
        // First search for the song to get its URL
        const searchResponse = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(title + ' ' + artist)}`, {
            headers: {
                'Authorization': `Bearer ${process.env.GENIUS_API_KEY}`
            }
        });

        if (!searchResponse.data.response.hits.length) {
            return res.status(404).json({ error: `No songs found for "${title}" by "${artist}"` });
        }

        const songUrl = searchResponse.data.response.hits[0].result.url;
        const songResponse = await axios.get(songUrl);
        const $ = cheerio.load(songResponse.data);

        // Extract lyrics
        const lyrics: string[] = [];
        
        // Find all lyrics spans
        $('.ReferentFragment-desktop__Highlight-sc-380d78dd-1').each((_, element) => {
            const lineText = $(element).text().trim();
            if (lineText && !lineText.includes('Contributors') && !lineText.includes('Translations') && !lineText.includes('Read More')) {
                lyrics.push(lineText);
            }
        });

        if (lyrics.length === 0) {
            return res.status(404).json({ error: 'Lyrics not found for this song' });
        }

        return res.status(200).json({ lyrics });
    } catch (error: any) {
        console.error('Error fetching lyrics:', error);
        return res.status(500).json({ 
            error: error.message || 'Failed to fetch lyrics from Genius API'
        });
    }
}
