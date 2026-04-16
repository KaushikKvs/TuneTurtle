import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import { CheckCircle2 } from "lucide-react";

const AlbumItem = ({ image, name, desc, id, price, isFree, artistId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { purchasedAlbumIds } = React.useContext(PlayerContext);

  // Robust comparison for Artist ownership OR regular purchase
  const isOwnedByMe = (artistId && user?.id && String(artistId).trim() === String(user.id).trim()) ||
                      (purchasedAlbumIds && purchasedAlbumIds.includes(id));

  return (
    <div
      className="premium-tracer min-w-[180px] p-3 rounded-xl cursor-pointer hover:bg-[var(--bg-hover)] transition-all duration-300 ease-in-out group hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--accent-glow)] animate-slide-up backdrop-blur-sm"
      onClick={() => navigate(`/albums/${id}`)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-sm mb-3">
        <img
          src={image}
          alt="image"
          className="w-40 h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center">
            <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#000] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
        </div>
      </div>
      <p className="font-bold mt-2 mb-1 text-[var(--text-primary)] truncate transition-colors duration-300 group-hover:text-[var(--accent)]">{name}</p>
      <div className="flex items-center justify-between gap-2">
         <p className="text-[var(--text-meta)] text-xs font-medium truncate flex-1">{desc}</p>
          {isOwnedByMe ? (
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 tracking-tighter uppercase flex items-center gap-1">
               <CheckCircle2 className="w-2.5 h-2.5" /> Owned ✅
            </span>
          ) : (
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-sm transition-colors ${isFree ? 'bg-[var(--text-meta)]/10 text-[var(--text-meta)] border border-[var(--text-meta)]/20' : 'bg-[var(--text-primary)] text-[var(--bg-base)] group-hover:bg-[var(--accent)] group-hover:text-[#000]'}`}>
                {isFree ? "FREE" : `₹${price || 0}`}
            </span>
          )}
      </div>
    </div>
  );
};

export default AlbumItem;
