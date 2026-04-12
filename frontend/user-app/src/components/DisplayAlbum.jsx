import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import { Clock } from "lucide-react";

const DisplayAlbum = ({ album }) => {
  const { id } = useParams();
  const { albumsData, songsData } = useContext(PlayerContext);

  return albumsData ? (
    <>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img src={album?.imageUrl} alt="" className="w-80 h-80 rounded" />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{album?.name}</h2>
          <h4>{album?.desc}</h4>
          <p className="mt-1">
            <img
              src={assets?.logo}
              alt="logo"
              className="inline-block w-5 mr-1"
            />
            <b>TuneTurtle </b> ● 1,23,456 likes ● <b> 6 songs ●</b> about 2 hr
            30min
          </p>
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-5 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>
        </p>
        <p>Song Name</p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <Clock className="m-auto w-4" />
      </div>
      <hr />
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
              className="grid grid-cols-5 sm:grid-cols-5 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
            >
              <p className="text-white">
                <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                <img src={item.image} alt="" className="inline w-10 mr-5" />
              </p>
              <p className="text-[15px]">{item.name}</p>
              <p className="text-[15px]">{album?.name}</p>
              <p className="text-[15px] hidden sm:block">
                {diffDays === 0 ? "Today" : `${diffDays} days ago`}
              </p>
              <p className="text-[15px] text-center">{item.duration}</p>
            </div>
          );
        })}
    </>
  ) : null;
};

export default DisplayAlbum;
