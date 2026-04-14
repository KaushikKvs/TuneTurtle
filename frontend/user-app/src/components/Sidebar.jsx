import React, { useState, useEffect, useContext } from "react";
import { ArrowRight, Home, Library, Plus, Search, X, DollarSign, ListMusic, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext.jsx";
import { PlayerContext } from "../context/PlayerContext.jsx";
import { useAuth, API_BASE_URL } from "../context/AuthContext.jsx";
import { assets } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setIsSearchActive, clearSearch } =
    useSearch();

  const handleSearchClick = () => {
    setShowSearchInput(true);
    setIsSearchActive(true);
    navigate("/search");
  };

  const handleClearSearch = () => {
    setShowSearchInput(false);
    clearSearch();
  };

  const [artists, setArtists] = useState([]);
  const { mySubscriptions } = useContext(PlayerContext);
  const { user, getAuthHeaders } = useAuth();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/artists`, {
          headers: getAuthHeaders()
        });
        setArtists(data);
      } catch (error) {
        console.error("Failed to fetch artists", error);
      }
    };
    if (user) fetchArtists();
  }, [user]);

  const followedArtists = artists.filter(a => mySubscriptions?.includes(a.id));

  return (
    <div className="w-[25%] h-full p-3 flex flex-col gap-3 text-[var(--text-primary)] hidden lg:flex">
      <div className="bg-[var(--bg-surface)] px-6 py-6 rounded-2xl flex flex-col gap-6 border border-[var(--border-subtle)] shadow-xl">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group mb-2"
        >
          <div className="p-2 bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(29,185,84,0.2)] transition-all">
            <img src={assets.logo} alt="TuneTurtle" className="w-8 h-8 animate-pulse-slow" />
          </div>
          <p className="text-xl font-black tracking-tighter text-[var(--text-primary)]">TuneTurtle</p>
        </div>

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-4 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-sm">Home</p>
        </div>
        
        <div className="relative group">
          {!showSearchInput ? (
            <div
              onClick={handleSearchClick}
              className="flex items-center gap-4 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-sm">Search</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[var(--accent)]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search..."
                className="flex-1 bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-meta)] px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50 border border-[var(--border-subtle)]"
                autoFocus
              />
              <button
                onClick={handleClearSearch}
                className="p-1 hover:bg-[var(--bg-hover)] rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-[var(--text-meta)] hover:text-[var(--text-primary)]" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-[var(--bg-surface)] flex-1 rounded-2xl flex flex-col border border-[var(--border-subtle)] shadow-xl overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/20">
          <div className="flex items-center gap-3">
            <Library className="w-5 h-5 text-[var(--accent)]" />
            <p className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
                {user?.role === 'ARTIST' ? "Artist Portal" : "Your Library"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Plus 
                onClick={() => user?.role === 'ARTIST' ? navigate("/dashboard") : toast.success("Playlist feature coming soon!")} 
                className="w-4 h-4 cursor-pointer text-[var(--text-meta)] hover:text-[var(--accent)] transition-all hover:scale-125" 
            />
            <ArrowRight className="w-4 h-4 cursor-pointer text-[var(--text-meta)] hover:text-[var(--text-primary)] transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {user?.role === 'ARTIST' ? (
            /* Artist Sidebar Content */
            <div className="space-y-4 pt-2">
                <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] space-y-3">
                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Management</p>
                    <button 
                        onClick={() => navigate("/dashboard?tab=earnings")} 
                        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition w-full text-left p-2 hover:bg-[var(--bg-hover)] rounded-lg"
                    >
                        <DollarSign className="w-4 h-4 text-[var(--accent)]" /> My Earnings
                    </button>
                    <button 
                        onClick={() => navigate("/dashboard?tab=my_songs")} 
                        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition w-full text-left p-2 hover:bg-[var(--bg-hover)] rounded-lg"
                    >
                        <ListMusic className="w-4 h-4 text-[var(--accent)]" /> My Tracks
                    </button>
                </div>

                <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] space-y-3">
                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Quick Actions</p>
                    <button 
                        onClick={() => navigate("/dashboard?tab=upload_track")} 
                        className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition w-full text-left p-2 hover:bg-[var(--bg-hover)] rounded-lg group"
                    >
                        <div className="p-1.5 bg-[var(--accent)]/10 rounded-md group-hover:bg-[var(--accent)]/20 transition-colors">
                            <Plus className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                        Upload New Track
                    </button>
                    <button 
                        onClick={() => navigate("/dashboard?tab=upload")} 
                        className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition w-full text-left p-2 hover:bg-[var(--bg-hover)] rounded-lg group"
                    >
                        <div className="p-1.5 bg-[var(--accent)]/10 rounded-md group-hover:bg-[var(--accent)]/20 transition-colors">
                            <Library className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                        Create New Album
                    </button>
                </div>
            </div>
          ) : followedArtists.length > 0 ? (
            followedArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => navigate(`/artist/${artist.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] cursor-pointer transition-all border border-transparent hover:border-[var(--border-subtle)] group"
              >
                <div className="w-10 h-10 bg-[var(--bg-base)] rounded-full flex items-center justify-center group-hover:shadow-lg shadow-[var(--accent)]/20">
                   <Home className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div>
                  <p className="font-bold text-sm truncate">{artist.artistName}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{artist.genre || "Artist"}</p>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="p-4 bg-[var(--bg-hover)] rounded font-semibold flex flex-col items-start justify-start gap-1 border border-[var(--border-subtle)]">
                <h1>Create your first playlist</h1>
                <p className="font-light text-sm">It's easy we will help you</p>
                <button 
                    onClick={() => toast.success("Playlist feature coming soon!")}
                    className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg-base)] text-[13px] rounded-full mt-4 font-bold hover:scale-105 transition shadow-lg shadow-[var(--accent-glow)]"
                >
                  Create Playlist
                </button>
              </div>
              <div className="p-4 bg-[var(--bg-hover)] rounded font-semibold flex flex-col items-start justify-start gap-1 mt-4 border border-[var(--border-subtle)]">
                <h1>Discover new creators</h1>
                <p className="font-light text-sm">Find artists to follow and support</p>
                <button onClick={() => navigate('/artists')} className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg-base)] text-[13px] rounded-full mt-4 font-bold hover:scale-105 transition shadow-lg shadow-[var(--accent-glow)]">
                  Browse Artists
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
