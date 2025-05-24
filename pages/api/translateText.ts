import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Text and target language are required' });
    }

    try {
        // MyMemory Translation API - completely free
        const translationPromises = text.map(async (line: string) => {
            if (!line.trim()) return line; // Skip empty lines
            
            const response = await axios.get('https://api.mymemory.translated.net/get', {
                params: {
                    q: line,
                    langpair: `${sourceLanguage}|${targetLanguage}`,
                    de: 'your-email@example.com' // Optional: improves rate limits
                }
            });

            if (response.data && response.data.responseData) {
                return response.data.responseData.translatedText;
            }
            return line; // Return original if translation fails
        });

        const translatedLines = await Promise.all(translationPromises);

        return res.status(200).json({ 
            translatedText: translatedLines,
            sourceLanguage,
            targetLanguage
        });
    } catch (error: any) {
        console.error('Translation error:', error);
        return res.status(500).json({ 
            error: error.message || 'Failed to translate text'
        });
    }
} 