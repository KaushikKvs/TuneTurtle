import React from "react";
import { useNavigate } from "react-router-dom";

const AlbumItem = ({ image, name, desc, id, price, isFree }) => {
  const navigate = useNavigate();
  return (
    <div
      className="min-w-[180px] p-3 rounded-xl cursor-pointer hover:bg-[var(--bg-hover)] transition-all group hover:scale-105"
      onClick={() => navigate(`/albums/${id}`)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-[var(--accent-glow)] transition-all">
        <img
          src={image}
          alt="image"
          className="w-40 h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
      </div>
      <p className="font-bold mt-3 mb-1 text-[var(--text-primary)] truncate">{name}</p>
      <div className="flex items-center justify-between gap-2">
         <p className="text-[var(--text-meta)] text-xs font-medium truncate flex-1">{desc}</p>
         <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm ${isFree ? 'bg-[var(--text-meta)]/20 text-[var(--text-meta)]' : 'bg-[var(--tag-bg)] text-[var(--tag-text)]'}`}>
            {isFree ? "FREE" : `₹${price || 0}`}
         </span>
      </div>
    </div>
  );
};

export default AlbumItem;
