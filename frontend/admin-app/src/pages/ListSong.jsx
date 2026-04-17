import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Trash2, Music, ExternalLink, RefreshCw } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

const ListSong = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAuthHeaders } = useAuth();

    const fetchSongs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/songs`, {
                headers: getAuthHeaders()
            });
            if (response.data.success) {
                setSongs(response.data.songs);
            }
        } catch (error) {
            toast.error("Failed to fetch songs");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this track from the platform?")) return;
        
        try {
            await axios.delete(`${API_BASE_URL}/api/songs/${id}`, {
                headers: getAuthHeaders()
            });
            toast.success("Song removed successfully");
            setSongs(songs.filter(s => s.id !== id && s._id !== id));
        } catch (error) {
            toast.error("Failed to delete song");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Audio Tracks</h1>
                    <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage and moderate all tracks across the platform</p>
                </div>
                <button 
                    onClick={fetchSongs}
                    disabled={loading}
                    className="p-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] rounded-xl border border-[var(--border-subtle)] transition-all group shadow-sm hover:border-[var(--dashboard-accent)]/30"
                >
                    <RefreshCw className={`w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--dashboard-accent)] transition-colors ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/50">
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest">Track</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-center">Album</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-center">Views</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-center">Pricing</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-center">Duration</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-center whitespace-nowrap">Artist ID</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {songs.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-24 text-center text-[var(--text-meta)]">
                                        <Music className="w-16 h-16 mx-auto mb-4 opacity-5" />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">No tracks found in the database.</p>
                                    </td>
                                </tr>
                            ) : (
                                songs.map((song) => (
                                    <tr key={song.id || song._id} className="hover:bg-[var(--bg-base)]/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-[var(--bg-base)] flex-shrink-0 relative overflow-hidden group-hover:shadow-lg transition-all shadow-sm">
                                                    {song.image ? (
                                                        <img src={song.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Music className="w-5 h-5 text-[var(--text-meta)]" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-[var(--text-primary)] truncate tracking-tight">{song.name}</p>
                                                    <p className="text-[11px] text-[var(--text-secondary)] truncate font-medium">{song.desc}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 bg-[var(--bg-base)] rounded-full text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest border border-[var(--border-subtle)]">
                                                {song.album || "Single"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-sm font-black text-[var(--text-primary)] tracking-tight">
                                                {(song.views || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            {song.isFree ? (
                                                <span className="text-[10px] font-black text-[var(--accent)] tracking-widest">FREE</span>
                                            ) : (
                                                <span className="text-sm font-black text-[var(--accent)] tracking-tight">₹{song.price || 0}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-center text-xs font-bold text-[var(--text-secondary)] tabular-nums opacity-60">
                                            {song.duration || "--:--"}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-[10px] font-black text-[var(--text-meta)] uppercase opacity-40 select-all cursor-copy hover:opacity-100 transition-opacity">#{song.artistId?.slice(-6) || "N/A"}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a 
                                                    href={song.file} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="p-2 text-[var(--text-meta)] hover:text-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)]/10 rounded-lg transition-all border border-transparent hover:border-[var(--dashboard-accent)]/20 shadow-sm"
                                                    title="Preview Track"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button 
                                                    onClick={() => handleDelete(song.id || song._id)}
                                                    className="p-2 text-[var(--text-meta)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                                                    title="Delete Track"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListSong;
