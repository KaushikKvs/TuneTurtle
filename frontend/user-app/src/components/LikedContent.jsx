import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import SongItem from "./SongItem";
import AlbumItem from "./AlbumItem";
import { Heart, Music, Disc } from "lucide-react";

const LikedContent = () => {
    const { songsData, albumsData } = useContext(PlayerContext);
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-[var(--text-meta)]">
                <Lock className="w-16 h-16 mb-4 opacity-20" />
                <h2 className="text-xl font-bold">Login to see your liked content</h2>
            </div>
        );
    }

    const likedSongs = songsData.filter(song => song.likedBy?.includes(user.id));
    const likedAlbums = albumsData.filter(album => album.likedBy?.includes(user.id));

    const isEmpty = likedSongs.length === 0 && likedAlbums.length === 0;

    return (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-5 mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-glow)] rounded-3xl flex items-center justify-center shadow-2xl shadow-[var(--accent-glow)]/40 transform -rotate-3">
                    <Heart className="w-10 h-10 text-[var(--bg-base)] fill-current" />
                </div>
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">Liked Content</h1>
                    <p className="text-[var(--text-secondary)] font-medium mt-1">
                        {likedSongs.length} songs ● {likedAlbums.length} albums
                    </p>
                </div>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[var(--border-subtle)] rounded-[2.5rem] bg-[var(--bg-card)]/30 backdrop-blur-sm">
                    <Music className="w-16 h-16 text-[var(--text-meta)] mb-4 opacity-20 animate-bounce" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Your collection is empty</h3>
                    <p className="text-[var(--text-secondary)] mt-1">Start liking tracks and albums to see them here!</p>
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Liked Albums Section */}
                    {likedAlbums.length > 0 && (
                        <section className="animate-in slide-in-from-left duration-700 delay-100">
                            <div className="flex items-center gap-3 mb-8">
                                <Disc className="w-6 h-6 text-[var(--accent)]" />
                                <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)] uppercase">Liked Albums</h2>
                            </div>
                            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                                {likedAlbums.map((item, index) => (
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
                        </section>
                    )}

                    {/* Liked Songs Section */}
                    {likedSongs.length > 0 && (
                        <section className="animate-in slide-in-from-left duration-700 delay-200">
                            <div className="flex items-center gap-3 mb-8">
                                <Music className="w-6 h-6 text-[var(--accent)]" />
                                <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)] uppercase">Liked Songs</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
                                {likedSongs.map((item, index) => (
                                    <SongItem
                                        key={index}
                                        name={item.name}
                                        desc={item.desc}
                                        id={item._id}
                                        image={item.image}
                                        price={item.price}
                                        isFree={item.isFree}
                                        artistId={item.artistId}
                                        likedBy={item.likedBy}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default LikedContent;
