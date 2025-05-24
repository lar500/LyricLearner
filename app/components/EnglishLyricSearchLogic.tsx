"use client";
import { useState } from "react";

const EnglishLyricSearchLogic = () => {
  const [query, setQuery] = useState("");
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [translatedLyrics, setTranslatedLyrics] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [singer, setSinger] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Common languages for translation
  const languages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "nl", name: "Dutch" },
    { code: "sv", name: "Swedish" },
    { code: "no", name: "Norwegian" },
    { code: "da", name: "Danish" },
    { code: "fi", name: "Finnish" },
    { code: "pl", name: "Polish" },
    { code: "tr", name: "Turkish" },
    { code: "th", name: "Thai" },
    { code: "vi", name: "Vietnamese" },
    { code: "el", name: "Greek" },
    { code: "he", name: "Hebrew" },
    { code: "cs", name: "Czech" },
    { code: "hu", name: "Hungarian" },
    { code: "ro", name: "Romanian" },
    { code: "bg", name: "Bulgarian" },
    { code: "hr", name: "Croatian" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "et", name: "Estonian" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "uk", name: "Ukrainian" },
    { code: "be", name: "Belarusian" },
    { code: "mk", name: "Macedonian" },
    { code: "sr", name: "Serbian" },
    { code: "bs", name: "Bosnian" },
    { code: "mt", name: "Maltese" },
    { code: "cy", name: "Welsh" },
    { code: "ga", name: "Irish" },
    { code: "is", name: "Icelandic" },
    { code: "fa", name: "Persian" },
    { code: "ur", name: "Urdu" },
    { code: "bn", name: "Bengali" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "ml", name: "Malayalam" },
    { code: "kn", name: "Kannada" },
    { code: "gu", name: "Gujarati" },
    { code: "pa", name: "Punjabi" },
    { code: "mr", name: "Marathi" },
    { code: "ne", name: "Nepali" },
    { code: "si", name: "Sinhala" },
    { code: "my", name: "Burmese" },
    { code: "km", name: "Khmer" },
    { code: "lo", name: "Lao" },
    { code: "ka", name: "Georgian" },
    { code: "am", name: "Amharic" },
    { code: "sw", name: "Swahili" },
    { code: "zu", name: "Zulu" },
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "az", name: "Azerbaijani" },
    { code: "eu", name: "Basque" },
    { code: "hy", name: "Armenian" },
    { code: "kk", name: "Kazakh" },
    { code: "ky", name: "Kyrgyz" },
    { code: "uz", name: "Uzbek" },
    { code: "tg", name: "Tajik" },
    { code: "mn", name: "Mongolian" },
    { code: "tt", name: "Tatar" },
    { code: "ca", name: "Catalan" },
    { code: "gl", name: "Galician" },
    { code: "eu", name: "Basque" },
    { code: "eo", name: "Esperanto" },
    { code: "la", name: "Latin" },
    { code: "yi", name: "Yiddish" },
    { code: "ms", name: "Malay" },
    { code: "id", name: "Indonesian" },
    { code: "tl", name: "Filipino" },
    { code: "mg", name: "Malagasy" },
    { code: "sm", name: "Samoan" },
    { code: "to", name: "Tongan" },
    { code: "fj", name: "Fijian" },
    { code: "haw", name: "Hawaiian" },
  ];

  const searchSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLyrics([]);
    setTranslatedLyrics([]);
    setSinger("");
    setName("");
    setUrl("");
    setShowTranslation(false);

    try {
      const response = await fetch(
        `/api/searchLyrics?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Error fetching songs");
      }

      const data = await response.json();

      if (data.length > 0) {
        // Use the first song in the list, or allow the user to choose
        const { title, artist, url } = data[0];
        fetchLyrics(title, artist);
        setSinger(artist);
        setName(title);
        setUrl(url);
      } else {
        setError("No songs found");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const fetchLyrics = async (title: string, artist: string) => {
    try {
      const lyricsResponse = await fetch("/api/getEnglishLyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, artist }),
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
    } catch (err: any) {
      setError(err.message || "Error fetching lyrics");
    }
  };

  const translateLyrics = async () => {
    if (!selectedLanguage || lyrics.length === 0) {
      setError("Please select a language and ensure lyrics are loaded");
      return;
    }

    setIsTranslating(true);
    setError("");

    try {
      const response = await fetch("/api/translateText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: lyrics,
          targetLanguage: selectedLanguage,
          sourceLanguage: "en",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error translating lyrics");
      }

      const translationData = await response.json();
      setTranslatedLyrics(translationData.translatedText);
      setShowTranslation(true);
    } catch (err: any) {
      setError(err.message || "Error translating lyrics");
    } finally {
      setIsTranslating(false);
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
          placeholder="Enter song name..."
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
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 0 1 7 0 3.5 3.5 0 0 1-7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </label>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {name && singer && (
        <div className="pt-5 pb-5">
          <button
            type="submit"
            className="pt-2 pb-5 text-2xl btn btn-neutral"
            onClick={() => (window.location.href = url)}
          >
            {name && (
              <p>
                {name} by {singer}
              </p>
            )}
          </button>
        </div>
      )}

      {/* Translation controls */}
      {lyrics.length > 0 && (
        <div className="translation-controls bg-base-300 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-3">Translate Lyrics</h3>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="select select-bordered w-full sm:w-auto"
            >
              <option value="">Select language...</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button
              onClick={translateLyrics}
              disabled={!selectedLanguage || isTranslating}
              className="btn btn-primary"
            >
              {isTranslating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </button>
            {showTranslation && (
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="btn btn-secondary"
              >
                {showTranslation ? "Show Original" : "Show Translation"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Display lyrics */}
      {lyrics.length > 0 && (
        <div className="lyrics-container bg-base-200 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {showTranslation && translatedLyrics.length > 0
                ? `Lyrics (${
                    languages.find((l) => l.code === selectedLanguage)?.name
                  })`
                : "Lyrics (English)"}
            </h3>
          </div>
          <div className="space-y-2">
            {(showTranslation && translatedLyrics.length > 0
              ? translatedLyrics
              : lyrics
            ).map((line, index) => (
              <p key={index} className="text-base leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      <p className="pt-5">
        Lyrics provided by Genius
        {translatedLyrics.length > 0 ? " | Translation by MyMemory" : ""}
      </p>
    </div>
  );
};

export default EnglishLyricSearchLogic;
