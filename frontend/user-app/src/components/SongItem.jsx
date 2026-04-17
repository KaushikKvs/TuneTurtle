import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { ShoppingCart, Play, Lock, CheckCircle2, Heart } from "lucide-react";
import { useAuth, API_BASE_URL } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";

const SongItem = ({ name, image, desc, id, price, isFree, artistId, likedBy: initialLikedBy }) => {
  const { playWithId, mySubscriptions, purchasedSongIds, cartItems, addToCart, expiryMap, songsData, setSongsData } = useContext(PlayerContext);
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  
  // Local state for the specific song item to ensure immediate UI feedback
  const [isLiking, setIsLiking] = useState(false);
  
  // Find the song in global data to get latest likedBy
  const songInGlobal = songsData.find(s => String(s._id) === String(id) || String(s.id) === String(id));
  const currentLikedBy = songInGlobal?.likedBy || initialLikedBy || [];
  const hasLiked = currentLikedBy.some(id => String(id) === String(user?.id));
  const isCreator = artistId && user?.id && String(artistId).trim() === String(user.id).trim();
  
  const now = new Date();
  const songExpiry = expiryMap[id];
  const isExpired = songExpiry && new Date(songExpiry) < now;

  const hasAccess = (isFree || price === 0) || (user?.role === 'ADMIN') || 
                   isCreator || 
                   (mySubscriptions?.includes(artistId)) || (purchasedSongIds?.includes(id) && !isExpired);
  const isInCart = cartItems?.some((item) => item.songId === id && item.type === "SONG");
  const isParentAlbumInCart = cartItems?.some((item) => item.type === "ALBUM" && (item.songName === desc || item.albumName === desc)); // In SongItem, desc is often the album name

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent playing when clicking buy
    if (!isAuthenticated()) {
      toast.error("Please login to purchase");
      return;
    }
    if (hasAccess) return;
    addToCart({ _id: id, name, image, desc, artistId, price, isFree });
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
        toast.error("Login to like songs");
        return;
    }
    if (isCreator) {
        toast.error("You cannot like your own creation!");
        return;
    }
    if (isLiking) return;
    setIsLiking(true);

    try {
        const response = await axios.patch(`${API_BASE_URL}/api/songs/${id}/like`, {}, {
            headers: getAuthHeaders()
        });
        
        if (response.status === 200) {
            const updatedSong = response.data;
            // Sync with global context
            setSongsData(prev => prev.map(s => 
                (String(s._id) === String(id) || String(s.id) === String(id)) ? updatedSong : s
            ));
            
            if (updatedSong.likedBy?.includes(user.id)) {
                toast.success(`Liked ${name}`, { id: `like-song-${id}` });
            } else {
                toast.success(`Removed like from ${name}`, { id: `like-song-${id}` });
            }
        }
    } catch (error) {
        console.error("Song like error:", error);
        const errorMsg = error.response?.data?.message || error.response?.data || "Failed to update like";
        toast.error(errorMsg, { id: `like-error-${id}` });
    } finally {
        setIsLiking(false);
    }
  };

  return (
    <div 
      onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (hasAccess) {
              playWithId(id);
          } else {
              handleAddToCart(e);
          }
      }} 
      className="premium-tracer group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer bg-transparent hover:bg-[var(--bg-hover)] transition-all duration-300 ease-in-out hover:shadow-[0_8px_30px_var(--accent-glow)] hover:-translate-y-1 animate-slide-up backdrop-blur-sm"
    >
      <div className="relative overflow-hidden rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 shadow-sm group-hover:shadow-[0_4px_15px_var(--accent-glow)] transition-all duration-500 ease-out">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {hasAccess ? (
                <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Play className="w-5 h-5 text-white fill-current ml-1" />
                </div>
            ) : (
                <div className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <Lock className="w-5 h-5 text-white opacity-80" />
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-1">
            <p className="font-black text-[var(--text-primary)] truncate transition-colors group-hover:text-[var(--accent)]">{name}</p>
            {!hasAccess && !isFree && (
                <span className="text-[8px] bg-[var(--accent)]/10 text-[var(--accent)] px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-[var(--accent)]/20">Premium</span>
            )}
            <div className="flex items-center gap-1 group/heart">
                <Heart 
                    onClick={handleLike}
                    className={`w-3.5 h-3.5 ml-1 transition-all duration-300 hover:scale-125 cursor-pointer ${
                        isCreator ? "text-[var(--accent)]/30 fill-none cursor-default" :
                        hasLiked ? "text-[var(--accent)] fill-current" : "text-[var(--text-meta)] fill-none opacity-0 group-hover:opacity-100"
                    }`} 
                />
                <span className={`text-[10px] font-bold text-[var(--accent)] transition-opacity ${currentLikedBy.length > 0 ? "opacity-100" : "opacity-0 group-hover/heart:opacity-100"}`}>
                    {currentLikedBy.length}
                </span>
            </div>
        </div>
        <p className="text-[var(--text-secondary)] text-xs font-medium truncate opacity-70 group-hover:opacity-100 transition-opacity">{desc}</p>
      </div>

      <div className="flex flex-col items-end gap-2 pr-2">
         {isFree ? (
             <span className="text-[10px] font-black px-2 py-1 rounded-full bg-[var(--text-meta)]/10 text-[var(--text-meta)] border border-[var(--text-meta)]/20 tracking-tighter uppercase">
               Digital Access Free
             </span>
         ) : hasAccess ? (
            <span className="text-[10px] font-black px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 tracking-tighter uppercase flex items-center gap-1">
               <CheckCircle2 className="w-2.5 h-2.5" /> Owned ✅
            </span>
         ) : isInCart ? (
            <span className="text-[10px] font-black px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 tracking-tighter uppercase flex items-center gap-1">
               <CheckCircle2 className="w-2.5 h-2.5" /> In Cart 🛒
            </span>
         ) : isParentAlbumInCart ? (
            <span className="text-[10px] font-black px-2 py-1 rounded-full bg-[var(--bg-hover)] text-[var(--accent)] border border-[var(--accent)]/10 tracking-tighter uppercase flex items-center gap-1 opacity-60">
               <ShoppingCart className="w-2.5 h-2.5" /> Album in Cart
            </span>
         ) : (
            <button 
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-base)] px-4 py-2 rounded-xl font-bold text-xs hover:bg-[var(--accent)] hover:text-white transition-all transform active:scale-95 shadow-lg shadow-black/20"
            >
                <ShoppingCart className="w-3.5 h-3.5" />
                {isExpired ? "Renew 🔄" : `₹${price || 0}`}
            </button>
         )}
      </div>
    </div>
  );
};

export default SongItem;
