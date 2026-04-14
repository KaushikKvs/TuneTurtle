import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import { Clock, ShoppingCart } from "lucide-react";
import axios from "axios";
import { API_BASE_URL, useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const DisplayAlbum = ({ album }) => {
  const { id } = useParams();
  const { albumsData, songsData } = useContext(PlayerContext);
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const [buying, setBuying] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to purchase");
      return;
    }
    setBuying(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/transactions/checkout`,
        {
          artistId: album?.artistId,
          type: "ALBUM",
          itemId: album?._id,
          amountPaid: album?.price || 0
        },
        { headers: getAuthHeaders() }
      );
      toast.success(`Successfully purchased ${album.name}!`);
    } catch (error) {
      toast.error("Purchase failed: " + (error.response?.data || error.message));
    }
    setBuying(false);
  };

  const albumSongs = songsData.filter((song) => song.album === album?.name);
  
  const calculateTotalDuration = () => {
    let totalSeconds = 0;
    albumSongs.forEach(song => {
      const parts = song.duration.split(':');
      if (parts.length === 2) {
        totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const getStableLikes = (id) => {
    if (!id) return "0";
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (sum * 123 % 50000).toLocaleString();
  };

  return albumsData ? (
    <>
      <div className="mt-10 flex gap-10 flex-col md:flex-row md:items-end">
        <img src={album?.imageUrl} alt="" className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl object-cover transition-transform hover:scale-105" />
        <div className="flex flex-col">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Album</p>
          <h2 className="text-5xl font-extrabold mb-6 md:text-8xl text-[var(--text-primary)] tracking-tight">{album?.name}</h2>
          <h4 className="text-[var(--text-secondary)] text-lg mb-4">{album?.desc}</h4>
          <p className="flex items-center gap-3 text-sm text-[var(--text-meta)]">
            <img
              src={assets?.logo}
              alt="logo"
              className="w-5 h-5 animate-pulse-slow"
            />
            <span>●</span>
            <span className="text-[var(--accent)] font-bold">{getStableLikes(album?._id)} likes</span>
            <span>●</span>
            <span className="text-[var(--accent)] font-bold">{albumSongs.length} songs</span>
            <span>●</span>
            <span className="text-[var(--accent)] font-bold">{calculateTotalDuration()}</span>
          </p>
          {album?.price > 0 && !album?.isFree && (
            <div className="mt-8">
               <button onClick={handleCheckout} disabled={buying} className="flex gap-3 items-center bg-[var(--accent)] text-[var(--bg-base)] px-8 py-3 rounded-full font-bold transition-all shadow-xl hover:shadow-[var(--accent-glow)] hover:scale-105 disabled:opacity-50">
                 <ShoppingCart className="w-5 h-5"/> 
                 {buying ? "Processing..." : `Buy Digital Album for ₹${album.price}`}
               </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-5 mt-12 mb-4 pl-4 text-[var(--text-meta)] text-xs font-bold uppercase tracking-widest">
        <p className="flex items-center">
          <span className="mr-4">#</span>
          <span>Title</span>
        </p>
        <p className="hidden md:block">Album</p>
        <p className="hidden sm:block">Release Date</p>
        <div className="flex justify-center">
            <Clock className="w-4 h-4" />
        </div>
        <p className="text-right pr-4">Price</p>
      </div>
      <hr className="border-[var(--border-subtle)]" />
      <div className="mt-4 flex flex-col gap-1">
        {songsData
            .filter((song) => song.album === album?.name)
            .map((item, index) => {
            const createdAt = item.createdAt
                ? new Date(item.createdAt)
                : new Date();
            const now = new Date();
            const diffDays = Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24));

            return (
                <div
                key={index}
                className="grid grid-cols-5 sm:grid-cols-5 gap-4 p-3 rounded-xl items-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all group cursor-pointer"
                >
                <div className="flex items-center gap-4">
                    <span className="w-4 text-[var(--text-meta)] font-mono group-hover:text-[var(--accent)] transition-colors">{index + 1}</span>
                    <img src={item.image} alt="" className="w-10 h-10 rounded shadow-md" />
                    <span className="text-[var(--text-primary)] font-bold truncate">{item.name}</span>
                </div>
                <p className="text-sm hidden md:block truncate">{album?.name}</p>
                <p className="text-sm hidden sm:block text-[var(--text-meta)]">
                    {diffDays === 0 ? "Today" : `${diffDays} days ago`}
                </p>
                <p className="text-sm text-center font-mono">{item.duration}</p>
                <div className="text-right pr-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${item.isFree ? 'bg-[var(--text-meta)]/20 text-[var(--text-meta)]' : 'bg-[var(--tag-bg)] text-[var(--tag-text)]'}`}>
                        {item.isFree ? "FREE" : `₹${item.price}`}
                    </span>
                </div>
                </div>
            );
            })}
      </div>
    </>
  ) : null;
};

export default DisplayAlbum;
