import React, { useContext, useEffect, useRef } from "react";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import { Routes, Route, useLocation } from "react-router-dom";
import Search from "./Search";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import ArtistsDirectory from "./ArtistsDirectory";
import ArtistProfile from "./ArtistProfile";
import MusicLibrary from "./MusicLibrary";
import CartPage from "./CartPage";
import LikedContent from "./LikedContent";
import { PlayerContext } from "../context/PlayerContext";
import { useTheme } from "../context/ThemeContext";
import { Disc } from "lucide-react";

// Placeholder for Podcasts tab
const PodcastsPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 animate-in zoom-in duration-700">
    <div className="relative mb-8">
        <Disc className="w-24 h-24 text-[var(--accent)] animate-spin-slow opacity-20" />
        <Disc className="w-16 h-16 text-[var(--accent)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
    </div>
    <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4 tracking-tight">Sonic <span className="text-[var(--accent)]">Podcasts</span></h2>
    <p className="text-[var(--text-secondary)] max-w-md mx-auto font-medium text-lg leading-relaxed">
      We're curating exclusive creator stories and sound design masterclasses. Stay tuned for the premiere.
    </p>
    <div className="mt-10 px-6 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-[var(--accent)]/20 shadow-lg">
        Coming Soon to TuneTurtle
    </div>
  </div>
);

const Display = ({ playerVisible, setPlayerVisible }) => {
  const { albumsData } = useContext(PlayerContext);
  const displayRef = useRef();
  const contentRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");

  const albumId = isAlbum ? location.pathname.split("/").pop() : "";

  // option chaining
  const album = isAlbum ? albumsData.find((x) => x._id == albumId) : null;

  const { theme } = useTheme();
  const bgColor = album?.bgColor || (theme === "tune-dark" ? "#121212" : "var(--bg-base)");

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, var(--bg-base))`;
    } else {
      // Dynamic themed mesh-like gradient
      const gradient = `radial-gradient(at 0% 0%, var(--accent-glow) 0px, transparent 50%), 
                        radial-gradient(at 100% 100%, var(--accent-glow) 0px, transparent 50%),
                        var(--bg-surface)`;
      displayRef.current.style.background = gradient;
    }
  }, [isAlbum, bgColor, theme]);

  return (
    <div
      ref={displayRef}
      className="premium-tracer flex-1 m-2 bg-[var(--bg-surface)] text-[var(--text-primary)] lg:ml-0 flex flex-col rounded-lg shadow-xl overflow-hidden transition-all duration-500 ease-in-out"
    >
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-10 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-6 pt-4 pb-2">
        <Navbar playerVisible={playerVisible} setPlayerVisible={setPlayerVisible} />
      </div>
      {/* Scrollable Content */}
      <div ref={contentRef} className="flex-1 px-6 pb-32 overflow-y-auto min-h-0 custom-scrollbar">
        <Routes>
          <Route path="/" element={<DisplayHome />} />
          <Route
            path="/albums/:id"
            element={
              <DisplayAlbum album={albumsData.find((x) => x._id === albumId)} />
            }
          />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/artists" element={<ArtistsDirectory />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/music" element={<MusicLibrary />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/podcasts" element={<PodcastsPlaceholder />} />
          <Route path="/liked" element={<LikedContent />} />
        </Routes>
      </div>
    </div>
  );
};

export default Display;
