import React, { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { Music, Search, Disc, Filter, LayoutGrid, List } from "lucide-react";

const MusicLibrary = () => {
  const { songsData, albumsData } = useContext(PlayerContext);
  const [activeTab, setActiveTab] = useState("all"); // "all", "albums", "songs"
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songsData.filter(song => 
    song.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlbums = albumsData.filter(album => 
    album.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 animate-in fade-in duration-700">
      {/* Search and Filter Header */}
      <div className="relative mb-16">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--text-primary)] mb-8">
            Marketplace <span className="text-[var(--accent)]">Library</span>
          </h1>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-[var(--text-meta)] group-focus-within:text-[var(--accent)] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search marketplace, artists, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-16 pr-12 py-5 bg-[var(--bg-surface)] border-2 border-[var(--border-subtle)] rounded-3xl text-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 transition-all placeholder:text-[var(--text-meta)] shadow-xl"
            />
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex gap-4 mt-10">
          {[
            { id: "all", label: "Everything", icon: LayoutGrid },
            { id: "albums", label: "Collections", icon: Disc },
            { id: "songs", label: "Singles", icon: Music }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm tracking-widest uppercase transition-all border ${
                activeTab === tab.id 
                  ? "bg-[var(--accent)] text-[var(--bg-base)] border-[var(--accent)] shadow-lg shadow-[var(--accent-glow)]/20" 
                  : "bg-[var(--bg-hover)] text-[var(--text-meta)] border-[var(--border-subtle)] hover:border-[var(--text-meta)]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-20 pb-32">
        {/* Albums Section */}
        {(activeTab === "all" || activeTab === "albums") && filteredAlbums.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <Disc className="w-8 h-8 text-[var(--accent)]" />
                Latest Collections
              </h2>
              <span className="text-xs font-bold text-[var(--text-meta)] uppercase opacity-50 tracking-[0.2em]">
                {filteredAlbums.length} Releases
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {filteredAlbums.map((item, index) => (
                <AlbumItem 
                  key={index} 
                  name={item.name} 
                  desc={item.desc} 
                  id={item._id} 
                  image={item.imageUrl} 
                  price={item.price} 
                  isFree={item.isFree}
                />
              ))}
            </div>
          </div>
        )}

        {/* Songs Section */}
        {(activeTab === "all" || activeTab === "songs") && filteredSongs.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <Music className="w-8 h-8 text-[var(--accent)]" />
                Featured Singles
              </h2>
              <span className="text-xs font-bold text-[var(--text-meta)] uppercase opacity-50 tracking-[0.2em]">
                {filteredSongs.length} Tracks
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSongs.map((item, index) => (
                <SongItem 
                  key={index} 
                  name={item.name} 
                  desc={item.desc} 
                  id={item._id} 
                  image={item.image} 
                  price={item.price} 
                  isFree={item.isFree}
                  artistId={item.artistId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === "albums" && filteredAlbums.length === 0) || 
          (activeTab === "songs" && filteredSongs.length === 0) || 
          (filteredAlbums.length === 0 && filteredSongs.length === 0)) && (
          <div className="py-32 text-center bg-[var(--bg-surface)] rounded-[3rem] border-4 border-dashed border-[var(--border-subtle)] animate-in zoom-in duration-500">
            <Filter className="w-16 h-16 text-[var(--text-meta)] mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-black text-[var(--text-primary)]">No assets found</h3>
            <p className="text-[var(--text-secondary)] mt-2 font-medium">Try broadening your search or exploring different categories.</p>
            <button 
                onClick={() => setSearchQuery("")}
                className="mt-8 text-[var(--accent)] font-bold border-b-2 border-[var(--accent)]"
            >
                Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicLibrary;
