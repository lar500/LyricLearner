import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <>
      <div className="navbar bg-[#171618]">
        <Link href="/" className="btn btn-ghost text-xl text-indian-yellow">
          Lyric Learner!
        </Link>
        <div className="flex-1">
          <Link href="/englishlyrics" className="btn btn-ghost text-white">
            English Lyrics
          </Link>
          <Link href="/azlyrics" className="btn btn-ghost text-white">
            AZLyrics
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;
