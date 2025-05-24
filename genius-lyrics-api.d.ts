declare module 'genius-lyrics-api' {
    interface Song {
        id: string;
        title: string;
        artist: string;
        lyrics: string;
        url: string;
        albumArt: string;
    }

    /**
     * Retrieves lyrics for a song using either a Genius URL or an options object.
     * @param arg - A Genius URL (string) or an object containing `apiKey`, `title`, `artist`, and optional flags.
     * @returns A Promise resolving to the song's lyrics as a string.
     */
    function getLyrics(arg:
        | {
            apiKey: string;
            title: string;
            artist: string;
            optimizeQuery?: boolean;
            authHeader?: boolean;
        }
    ): Promise<string>;

    function getAlbumArt(songId: string): Promise<string>;
    function getSong(query: string): Promise<Song>;
    function searchSong(query: string): Promise<Song[]>;
    function getSongById(songId: string): Promise<Song>;

    export {
        getLyrics,
        getAlbumArt,
        getSong,
        searchSong,
        getSongById
    };
}
