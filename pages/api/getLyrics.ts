import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { load } from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract title and artist from the request body
    const { title, artist } = req.body;

    if (!title || !artist) {
        return res.status(400).json({ error: 'Song title and artist name are required' });
    }

    try {
        const searchUrl = `https://www.lyricsox.com/search?q=${encodeURIComponent(title + ' ' + artist)}`;

        const response = await axios.get(searchUrl);
        const $ = load(response.data);

        // Find the correct link from search results
        const songLink = $('a[href^="/"]').first().attr('href');

        if (!songLink) {
            return res.status(404).json({ error: 'Lyrics not found' });
        }

        // Construct the full song URL
        const songUrl = `https://www.lyricsox.com${songLink}`;

        const songPage = await axios.get(songUrl);
        const $$ = load(songPage.data);

        // Adjust the selector for the lyrics content as needed
        const lyrics = $$('div.dynamic-entry-content').text().trim();

        if (!lyrics) {
            return res.status(404).json({ error: 'Lyrics not found' });
        }

        res.status(200).json({ lyrics });

        const firstResult = $('a[href^="/lyrics/"]').first();

        if (!firstResult.length) {
            return res.status(404).json({ error: 'Lyrics not found' });
        }

        const songHtml = songPage.data;
        console.log('Song page HTML:', songHtml);

        // Scrape the lyrics from the song page (adjust the selector to the actual one)

        res.status(200).json({ lyrics });
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return res.status(500).json({ error: 'Failed to fetch lyrics' });
    }
}
