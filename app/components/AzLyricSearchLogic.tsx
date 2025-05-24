"use client";
import { useState } from "react";

const AzLyricSearchLogic = () => {
  const [query, setQuery] = useState("");
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [singer, setSinger] = useState("");
  const [name, setName] = useState("");

  const searchSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLyrics([]);
    setSinger("");
    setName("");

    try {
      // Split the query into title and artist if possible
      const parts = query.split(" by ");
      const title = parts[0].trim();
      const artist = parts[1] ? parts[1].trim() : "";

      if (!title) {
        setError("Please enter a song title");
        return;
      }

      // Fetch lyrics directly
      const lyricsResponse = await fetch("/api/getAzLyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          artist: artist,
        }),
      });

      if (!lyricsResponse.ok) {
        const errorData = await lyricsResponse.json();
        throw new Error(errorData.error || "Error fetching lyrics");
      }

      const lyricsData = await lyricsResponse.json();
      if (!lyricsData.lyrics || lyricsData.lyrics.length === 0) {
        throw new Error("No lyrics found");
      }

      setLyrics(lyricsData.lyrics);
      setName(title);
      if (artist) {
        setSinger(artist);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching lyrics");
    }
  };

  return (
    <div>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter song name (optional: by artist name)..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchSong(e);
            }
          }}
        />
        <button
          type="submit"
          onClick={searchSong}
          className="ml-2 p-2 text-white rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </label>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {name && singer && (
        <div className="pt-5 pb-5">
          <p className="pt-2 pb-5 text-2xl">
            {name} by {singer}
          </p>
        </div>
      )}
      {lyrics.length > 0 && (
        <div className="lyrics-container bg-base-200 p-6 rounded-lg">
          <div className="space-y-2">
            {lyrics.map((line, index) => (
              <p key={index} className="text-base leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
      <p className="pt-5">Lyrics provided by AZLyrics</p>
    </div>
  );
};

export default AzLyricSearchLogic;
