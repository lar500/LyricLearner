import type { NextApiRequest, NextApiResponse } from 'next';

interface Song {
    title: string;
    artist: string;
    url: string;
    thumbnailUrl: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = '_8V0SRi4JdEmRy5reZzlsGMV4dSslc6ehsO4YB7aDwchKC_6y9E5fqnmk7RJujiK';
    const baseUrl = 'https://api.genius.com';

    const { query } = req.query; // Grab query parameter from URL

    //if query doesn't exist or it's not a string, then it's invalid.
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Invalid Query Parameter' });
    }


    try {
        // Fetch data from the Genius API
        const response = await fetch(`${baseUrl}/search?q=${encodeURIComponent(query)}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching data from Genius API');
        }

        const data = await response.json();

        const songs: Song[] = data.response.hits.map((hit: any) => ({
            title: hit.result.title,
            artist: hit.result.primary_artist.name,
            url: hit.result.url,
            thumbnailUrl: hit.result.song_art_image_thumbnail_url,
        }));

        //sends a 200 OK response with the song data
        res.status(200).json(songs);

    } catch (error) {
        console.error('API error: ', error);
        return res.status(500).json({ error: 'Failed to fetch song data' });
    }
}
