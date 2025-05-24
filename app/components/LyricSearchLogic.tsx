'use client';
import { useState } from "react";

const LyricSearchLogic = () => {
  const [query, setQuery] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState('');
  const [singer, setSinger] = useState('');
  const [name, setName] = useState('');

  const searchSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLyrics('');
    setSinger('');
    setName('');

    try {
      //use the LyricsOX API
      const response = await fetch(`/api/searchLyrics?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Error fetching songs');
      }

      const data = await response.json();

      if (data.length > 0) {
        // Use the first song in the list, or allow the user to choose
        const { title, artist } = data[0];
        fetchLyrics(title, artist);  // Fetch lyrics with the correct title and artist
        setName(title);              // Set the song title correctly
        setSinger(artist);           // Set the artist correctly
      } else {
        setLyrics('No songs found');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const fetchLyrics = async (title: string, artist: string) => {
    try {
      // Send the POST request to get the lyrics
      const lyricsResponse = await fetch('/api/getLyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, artist }),
      });

      if (!lyricsResponse.ok) {
        throw new Error('Error fetching lyrics');
      }

      const lyricsData = await lyricsResponse.json();
      setLyrics(lyricsData.lyrics || 'No lyrics found');
    } catch (err: any) {
      setError(err.message || 'Error fetching lyrics');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter song name..."
        className="border p-2 rounded"
      />
      <button type="submit" onClick={searchSong} className="ml-2 p-2 bg-blue-500 text-white rounded">
        Search
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {name && <p>{name} by {singer}</p>}
      {lyrics && <pre>{lyrics}</pre>}
      <p>Lyrics provided by LyricsOX</p>
    </div>
  );
};

export default LyricSearchLogic;
