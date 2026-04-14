import React, { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Play, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const SongItem = ({ name, image, desc, id, price, isFree, artistId }) => {
  const { playWithId, mySubscriptions } = useContext(PlayerContext);
  const { user, getAuthHeaders, API_BASE_URL, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [buying, setBuying] = useState(false);

  // Check if user has access (free or subscribed or admin)
  const hasAccess = isFree || (user?.role === 'ADMIN') || (mySubscriptions?.includes(artistId));

  const handlePurchase = async (e) => {
    e.stopPropagation(); // Prevent playing when clicking buy
    if (!isAuthenticated()) {
      toast.error("Please login to purchase");
      return;
    }
    setBuying(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/transactions/checkout`,
        {
          artistId: artistId,
          type: "SONG",
          itemId: id,
          amountPaid: price || 0
        },
        { headers: getAuthHeaders() }
      );
      toast.success(`Successfully purchased ${name}!`);
    } catch (error) {
      toast.error("Purchase failed: " + (error.response?.data?.message || "Internal Error"));
    }
    setBuying(false);
  };

  return (
    <div 
      onClick={() => playWithId(id)} 
      className="group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer hover:bg-[var(--bg-hover)] transition-all duration-500 border border-transparent hover:border-[var(--border-subtle)] hover:shadow-2xl hover:shadow-[var(--accent-glow)]/5"
    >
      <div className="relative overflow-hidden rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 shadow-lg group-hover:shadow-[var(--accent-glow)]/20 transition-all duration-500">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
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
        </div>
        <p className="text-[var(--text-secondary)] text-xs font-medium truncate opacity-70 group-hover:opacity-100 transition-opacity">{desc}</p>
      </div>

      <div className="flex flex-col items-end gap-2 pr-2">
         {isFree ? (
             <span className="text-[10px] font-black px-2 py-1 rounded-full bg-[var(--text-meta)]/10 text-[var(--text-meta)] border border-[var(--text-meta)]/20 tracking-tighter uppercase">
               Digital Access Free
             </span>
         ) : hasAccess ? (
            <span className="text-[10px] font-black px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 tracking-tighter uppercase flex items-center gap-1">
               <Lock className="w-2.5 h-2.5" /> Licensed
            </span>
         ) : (
            <button 
                onClick={handlePurchase}
                disabled={buying}
                className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-base)] px-4 py-2 rounded-xl font-bold text-xs hover:bg-[var(--accent)] hover:text-white transition-all transform active:scale-95 shadow-lg shadow-black/20"
            >
                <ShoppingCart className="w-3.5 h-3.5" />
                {buying ? "..." : `₹${price || 0}`}
            </button>
         )}
      </div>
    </div>
  );
};

export default SongItem;
