import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, artist } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Song title is required' });
    }

    try {
        // First search for the song
        const searchQuery = artist ? `${title} ${artist}` : title;
        const searchUrl = `https://search.azlyrics.com/search.php?q=${encodeURIComponent(searchQuery)}`;
        console.log('Searching URL:', searchUrl);
        
        const searchResponse = await axios.get(searchUrl);
        const $ = cheerio.load(searchResponse.data);

        // Log the search results
        console.log('Found song links:', $('.song-list a').length);
        
        // Find the first song link
        const songLink = $('.song-list a').first().attr('href');
        if (!songLink) {
            console.log('No song link found in search results');
            return res.status(404).json({ error: 'Song not found' });
        }

        console.log('Found song link:', songLink);

        // Get the song page
        const songResponse = await axios.get(songLink);
        const $$ = cheerio.load(songResponse.data);

        // Extract lyrics
        const lyrics: string[] = [];
        
        // Try different selectors for lyrics
        const lyricsDiv = $$('.ringtone').nextAll('div');
        if (lyricsDiv.length === 0) {
            // Try alternative selector
            $$('div:not(.ringtone):not(.noprint)').each((_, element) => {
                const lineText = $$(element).text().trim();
                if (lineText && !lineText.includes('Submit Corrections') && !lineText.includes('Submit Lyrics')) {
                    lyrics.push(lineText);
                }
            });
        } else {
            lyricsDiv.each((_, element) => {
                const lineText = $$(element).text().trim();
                if (lineText && !lineText.includes('Submit Corrections') && !lineText.includes('Submit Lyrics')) {
                    lyrics.push(lineText);
                }
            });
        }

        console.log('Found lyrics lines:', lyrics.length);

        if (lyrics.length === 0) {
            return res.status(404).json({ error: 'Lyrics not found for this song' });
        }

        return res.status(200).json({ lyrics });
    } catch (error: any) {
        console.error('Error fetching lyrics:', error);
        return res.status(500).json({ 
            error: error.message || 'Failed to fetch lyrics from AZLyrics'
        });
    }
} 