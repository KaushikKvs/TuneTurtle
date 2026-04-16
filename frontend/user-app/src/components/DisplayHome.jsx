import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { useAuth } from "../context/AuthContext";

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext);
  const { user } = useAuth();

  // Helper for robust ID comparison
  const isMine = (artistId) => artistId && user?.id && String(artistId).trim() === String(user.id).trim();

  // Separate personal content from global content
  const myAlbums = albumsData.filter(album => isMine(album.artistId));
  const featuredAlbums = albumsData.filter(album => !isMine(album.artistId));
  
  const mySongs = songsData.filter(song => isMine(song.artistId));
  const trendingSongs = songsData.filter(song => !isMine(song.artistId));

  const isArtist = user?.role === 'ARTIST';

  return (
    <>
      {/* Immersive Parallax Hero Banner */}
      <div 
        className="premium-tracer relative mt-6 h-64 sm:h-80 md:h-[400px] mb-12 sm:mb-16 rounded-[2.5rem] overflow-hidden group shadow-2xl animate-in fade-in duration-1000"
        style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop')",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10 w-full">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">
                Discover the <br/><span className="text-[var(--accent)] drop-shadow-[0_0_15px_var(--accent-glow)]">Soundscape.</span>
            </h1>
            <p className="text-white/80 font-medium text-lg max-w-md hidden md:block">
                Stream curated marketplaces, support independent artists, and experience audio in high fidelity.
            </p>
        </div>
      </div>

      {/* Artist's Personal Discography - Only for Artists */}
      {isArtist && myAlbums.length > 0 && (
        <div className="mb-12 animate-slide-up bg-[var(--accent)]/5 p-8 rounded-[2rem] border border-[var(--accent)]/10 shadow-inner">
          <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[var(--accent)] rounded-full shadow-[0_0_15px_var(--accent-glow)]"></div>
              <h1 className="font-black tracking-tight text-3xl">Your Releases</h1>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {myAlbums.map((item, index) => (
              <div key={index} className="flex-shrink-0">
                  <AlbumItem
                    name={item.name}
                    desc={item.desc}
                    id={item._id}
                    image={item.imageUrl}
                    price={item.price}
                    isFree={item.isFree}
                    artistId={item.artistId}
                  />
              </div>
            ))}
          </div>
          {mySongs.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 opacity-90">
                {mySongs.slice(0, 4).map((item, index) => (
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
          )}
        </div>
      )}

      {/* Featured Charts - Global Content */}
      <div className="mb-12 animate-slide-up">
        <h1 className="my-5 font-black tracking-tight text-3xl">Featured Collections</h1>
        <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide">
          {featuredAlbums.map((item, index) => (
            <div key={index} className="flex-shrink-0">
                <AlbumItem
                  name={item.name}
                  desc={item.desc}
                  id={item._id}
                  image={item.imageUrl}
                  price={item.price}
                  isFree={item.isFree}
                  artistId={item.artistId}
                />
            </div>
          ))}
        </div>
      </div>

      {/* Today's Biggest Hits - Global Content */}
      <div className="mb-20">
        <h1 className="my-5 font-bold text-2xl">Today's Biggest Hits</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trendingSongs.map((item, index) => (
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
    </>
  );
};

export default DisplayHome;
