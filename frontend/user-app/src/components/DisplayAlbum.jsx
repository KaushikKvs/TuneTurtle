import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import { Clock, ShoppingCart, Heart, Info, CheckCircle, Play } from "lucide-react";
import axios from "axios";
import { API_BASE_URL, useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const DisplayAlbum = ({ album }) => {
  const { id } = useParams();
  const { albumsData, setAlbumsData, songsData, cartItems, addToCart, addAlbumToCart, purchasedAlbumIds, purchasedSongIds, expiryMap, mySubscriptions, playWithId } = useContext(PlayerContext);
  const { isAuthenticated, token, getAuthHeaders } = useAuth();
  const [localAlbum, setLocalAlbum] = useState(album);

  useEffect(() => {
    setLocalAlbum(album);
  }, [album]);
  
  const albumId = localAlbum?._id || id;
  const { user } = useAuth();
  const isAlbumPurchased = purchasedAlbumIds.includes(albumId) || 
                          (localAlbum?.artistId && user?.id && String(localAlbum.artistId).trim() === String(user.id).trim());
  const isAlbumInCart = cartItems.some(item => item.songId === albumId && item.type === "ALBUM");
  
  const albumExpiry = expiryMap[albumId];
  const isAlbumExpired = albumExpiry && new Date(albumExpiry) < new Date();

  const handleBuyAlbum = () => {
    if (!isAuthenticated()) {
      toast.error("Please login to purchase");
      return;
    }
    addAlbumToCart(localAlbum);
  };

  const [isLiking, setIsLiking] = useState(false);
  const hasLiked = localAlbum?.likedBy?.includes(user?.id);

  const handleLikeAlbum = async () => {
    if (!isAuthenticated()) {
        toast.error("Login to like this album");
        return;
    }
    if (isLiking) return;
    setIsLiking(true);

    try {
        const response = await axios.patch(`${API_BASE_URL}/api/albums/${albumId}/like`, {}, {
            headers: getAuthHeaders()
        });
        
        if (response.status === 200) {
            const updatedAlbum = response.data;
            setLocalAlbum(updatedAlbum);
            // Sync with global context so Home/Sidebar show correct counts
            setAlbumsData(prev => prev.map(a => 
                (String(a._id) === String(albumId) || String(a.id) === String(albumId)) ? updatedAlbum : a
            ));
            
            if (updatedAlbum.likedBy?.includes(user.id)) {
                toast.success("Added to liked albums");
            } else {
                toast.success("Removed from liked albums");
            }
        }
    } catch (error) {
        console.error("Like error:", error);
        toast.error("Failed to update like");
    } finally {
        setIsLiking(false);
    }
  };

  const albumSongs = songsData.filter((song) => song.album === localAlbum?.name);
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

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

  const getStableLikes = (albumObj) => {
    if (!albumObj) return "0";
    if (albumObj.likes !== undefined && albumObj.likes !== null) {
        return albumObj.likes.toLocaleString();
    }
    // Fallback if likes field is missing from backend response temporarily
    const sum = albumObj._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (sum * 123 % 500).toLocaleString();
  };

  const renderAlbumButton = () => {
      if (isAlbumPurchased && !isAlbumExpired) {
          return (
            <div className="flex flex-col gap-2">
                <button className="flex gap-3 items-center bg-green-600/20 text-green-400 border border-green-600/50 px-8 py-3 rounded-full font-bold cursor-default">
                    <ShoppingCart className="w-5 h-5"/> Owned ✅
                </button>
                <p className="text-[10px] text-[var(--text-meta)] font-bold uppercase tracking-wider pl-4">
                    Expires: {formatDate(albumExpiry)}
                </p>
            </div>
          );
      }
      if (isAlbumInCart) {
          return (
            <button className="flex gap-3 items-center bg-[var(--bg-hover)] text-[var(--accent)] border border-[var(--accent)]/30 px-8 py-3 rounded-full font-bold transition-all hover:scale-105">
                <ShoppingCart className="w-5 h-5"/> In Cart 🛒
            </button>
          );
      }
      return (
        <button onClick={handleBuyAlbum} className="flex gap-3 items-center bg-[var(--accent)] text-[var(--bg-base)] px-8 py-3 rounded-full font-bold transition-all shadow-xl hover:shadow-[var(--accent-glow)] hover:scale-105">
            <ShoppingCart className="w-5 h-5"/> 
            {isAlbumExpired ? "Renew 🔄" : `Buy Digital Album for ₹${localAlbum?.price}`}
        </button>
      );
  };

  return albumsData ? (
    <>
      <div className="mt-10 flex gap-10 flex-col md:flex-row md:items-end">
        <img src={localAlbum?.imageUrl} alt="" className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl object-cover transition-transform hover:scale-105" />
        <div className="flex flex-col">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-2">Album</p>
          <h2 className="text-5xl font-extrabold mb-6 md:text-8xl text-[var(--text-primary)] tracking-tight">{localAlbum?.name}</h2>
          <h4 className="text-[var(--text-secondary)] text-lg mb-4">{localAlbum?.desc}</h4>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-3 text-sm text-[var(--text-meta)]">
                <img
                src={assets?.logo}
                alt="logo"
                className="w-5 h-5 animate-pulse-slow"
                />
                <span>●</span>
                <span className="text-[var(--accent)] font-bold">{localAlbum?.likedBy?.length || 0} likes</span>
                <span>●</span>
                <span className="text-[var(--accent)] font-bold">{albumSongs.length} songs</span>
                <span>●</span>
                <span className="text-[var(--accent)] font-bold">{calculateTotalDuration()}</span>
            </p>
            <button 
                onClick={handleLikeAlbum}
                disabled={isLiking}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 transform active:scale-95 group ${
                    hasLiked 
                    ? "bg-[var(--accent)] text-[var(--bg-base)] shadow-lg shadow-[var(--accent-glow)]" 
                    : "bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent)]"
                }`}
            >
                <Heart 
                    className={`w-4 h-4 transition-all duration-300 ${hasLiked ? "fill-current scale-110" : "fill-none group-hover:scale-125"}`} 
                />
                <span className="text-xs font-bold">{hasLiked ? "Liked" : "Like"}</span>
                <span className="text-[10px] opacity-60 ml-1">({localAlbum?.likedBy?.length || 0})</span>
            </button>
          </div>
          {localAlbum?.price > 0 && !localAlbum?.isFree && (
            <div className="mt-8">
               {renderAlbumButton()}
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
            .filter((song) => song.album === localAlbum?.name)
            .map((item, index) => {
            const createdAt = item.createdAt
                ? new Date(item.createdAt)
                : new Date();
            const now = new Date();
            const diffDays = Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24));
            
            const isSongPurchased = purchasedSongIds.includes(item._id) || 
                                   (item.artistId && user?.id && String(item.artistId).trim() === String(user.id).trim()) ||
                                   mySubscriptions.includes(item.artistId);
            const songExpiry = expiryMap[item._id];
            const isSongExpired = songExpiry && new Date(songExpiry) < now;
            const hasAccess = item.isFree || (item.price === 0) || (isSongPurchased && !isSongExpired) || user?.role === 'ADMIN';
            const isSongInCart = cartItems.some(ci => ci.songId === item._id && ci.type === "SONG");

            return (
                <div
                key={index}
                onClick={(e) => {
                    const targetId = item._id || item.id;
                    console.log("Track Clicked. Access:", hasAccess, "ID:", targetId);
                    if (hasAccess) {
                        playWithId(targetId);
                    } else {
                        addToCart(item, "SONG");
                    }
                }}
                className="grid grid-cols-5 sm:grid-cols-5 gap-4 p-3 rounded-xl items-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all group cursor-pointer"
                >
                <div className="flex items-center gap-4">
                    <span className="w-4 text-[var(--text-meta)] font-mono group-hover:text-[var(--accent)] transition-colors">{index + 1}</span>
                    <img src={item.image} alt="" className="w-10 h-10 rounded shadow-md" />
                    <span className="text-[var(--text-primary)] font-bold truncate">{item.name}</span>
                </div>
                <p className="text-sm hidden md:block truncate">{localAlbum?.name}</p>
                <p className="text-sm hidden sm:block text-[var(--text-meta)]">
                    {diffDays === 0 ? "Today" : `${diffDays} days ago`}
                </p>
                <p className="text-sm text-center font-mono">{item.duration}</p>
                <div className="text-right pr-4" onClick={(e) => {
                    if (!isSongPurchased || isSongExpired) {
                        e.stopPropagation();
                        addToCart(item);
                    }
                }}>
                    {item.isFree ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--text-meta)]/20 text-[var(--text-meta)]">FREE</span>
                    ) : isSongPurchased && !isSongExpired ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-600/20 text-green-400 border border-green-600/50">OWNED ✅</span>
                    ) : isSongInCart ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/50">IN CART 🛒</span>
                    ) : isAlbumInCart ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--bg-hover)] text-[var(--accent)] border border-[var(--accent)]/10 opacity-60">ALBUM IN CART</span>
                    ) : (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--tag-bg)] text-[var(--tag-text)] hover:bg-[var(--accent)] hover:text-[var(--bg-base)] transition-colors">
                            {isSongExpired ? "RENEW 🔄" : `₹${item.price}`}
                        </span>
                    )}
                </div>
                </div>
            );
            })}
      </div>
    </>
  ) : null;
};

export default DisplayAlbum;
