import React from "react";

const SongItem = ({ name, desc, image, id }) => {
  return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
      <img
        src={image}
        alt="album image"
        className="w-40 h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded object-cover"
      />
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  );
};

export default SongItem;
