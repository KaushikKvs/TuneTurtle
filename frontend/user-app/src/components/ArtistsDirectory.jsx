import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API_BASE_URL } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

const ArtistsDirectory = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user, getAuthHeaders } = useAuth();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/artists`, {
          headers: getAuthHeaders()
        });
        if (Array.isArray(data)) {
          setArtists(data);
        }
      } catch (error) {
        console.error("Failed to fetch artists", error);
      }
      setLoading(false);
    };
    if (user) {
        fetchArtists();
    }
  }, [user, getAuthHeaders]);

  return (
    <div className="p-8 bg-[var(--bg-home-gradient)] min-h-screen text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-12">
            <h1 className="text-4xl font-black tracking-tighter mb-2">Discover New Creators</h1>
            <p className="text-[var(--text-secondary)] font-medium">Support independent artists directly through the marketplace.</p>
        </div>
        
        {loading ? (
          <div className="flex items-center gap-3 text-[var(--text-meta)] font-bold animate-pulse">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full"></div>
            Loading TuneTurtle Artists...
          </div>
        ) : artists.length === 0 ? (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-12 rounded-2xl text-center shadow-xl">
             <UserCircle className="w-16 h-16 text-[var(--text-meta)] mx-auto mb-4 opacity-20" />
             <h2 className="text-xl font-bold mb-2">No artists found on the platform yet.</h2>
             <p className="text-[var(--text-meta)]">Be the first to join the movement!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {artists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => navigate(`/artist/${artist.id}`)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="relative w-full aspect-square mb-4">
                    <div className="absolute inset-0 bg-[var(--accent)] rounded-full opacity-0 group-hover:opacity-10 group-hover:scale-110 shadow-[0_0_30px_var(--accent-glow)] transition-all duration-500"></div>
                    <div className="w-full h-full bg-[var(--bg-surface)] rounded-full border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--accent)]/30 transition-all shadow-lg overflow-hidden relative z-10">
                        <UserCircle className="w-2/3 h-2/3 text-[var(--text-meta)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                </div>
                <h3 className="font-bold text-lg truncate w-full text-center group-hover:text-[var(--accent)] transition-colors tracking-tight">{artist.artistName || artist.email.split('@')[0]}</h3>
                <p className="text-[var(--text-meta)] text-xs font-bold uppercase tracking-widest mt-1 opacity-60">{artist.genre || "Independent"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistsDirectory;
