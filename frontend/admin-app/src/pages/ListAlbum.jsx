import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Trash2, FolderHeart, ExternalLink, RefreshCw, Grid } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

const ListAlbum = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAuthHeaders } = useAuth();

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/albums`, {
                headers: getAuthHeaders()
            });
            if (response.data.success) {
                setAlbums(response.data.albums);
            }
        } catch (error) {
            toast.error("Failed to fetch albums");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this album? This may affect associated tracks.")) return;
        
        try {
            await axios.delete(`${API_BASE_URL}/api/albums/${id}`, {
                headers: getAuthHeaders()
            });
            toast.success("Album deleted successfully");
            setAlbums(albums.filter(a => a.id !== id && a._id !== id));
        } catch (error) {
            toast.error("Failed to delete album");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Music Collections</h1>
                    <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage all albums and releases published on TuneTurtle</p>
                </div>
                <button 
                    onClick={fetchAlbums}
                    disabled={loading}
                    className="p-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] rounded-xl border border-[var(--border-subtle)] transition-all group shadow-sm hover:border-[var(--dashboard-accent)]/30"
                >
                    <RefreshCw className={`w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--dashboard-accent)] transition-colors ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {albums.length === 0 && !loading ? (
                    <div className="col-span-full py-24 text-center text-[var(--text-meta)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-xl shadow-black/5">
                        <Grid className="w-16 h-16 mx-auto mb-4 opacity-5" />
                        <p className="font-bold uppercase tracking-widest text-[10px]">No collection records found.</p>
                    </div>
                ) : (
                    albums.map((album) => (
                        <div key={album.id || album._id} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-5 hover:border-[var(--dashboard-accent)]/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-black/5">
                            <div className="aspect-square rounded-2xl bg-[var(--bg-base)] mb-4 overflow-hidden relative shadow-lg group-hover:shadow-[var(--accent-glow)] transition-all">
                                {album.image ? (
                                    <img src={album.image} alt={album.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FolderHeart className="w-10 h-10 text-[var(--border-subtle)]" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    <button 
                                        onClick={() => handleDelete(album.id || album._id)}
                                        className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-black text-[var(--text-primary)] truncate tracking-tight">{album.name}</h3>
                                <p className="text-[11px] text-[var(--text-secondary)] truncate font-medium">{album.desc}</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-[var(--text-meta)] uppercase font-black tracking-widest">Pricing</span>
                                    <span className={`text-sm font-black text-[var(--accent)] tracking-tight uppercase`}>
                                        {album.isFree ? 'FREE' : `₹${album.price}`}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] text-[var(--text-meta)] uppercase font-black tracking-widest">Views</span>
                                    <span className="text-sm font-black text-[var(--text-primary)] tracking-tight">
                                        {(album.views || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div 
                                    className="w-9 h-9 rounded-lg bg-[var(--dashboard-accent)]/5 flex items-center justify-center border border-[var(--border-subtle)]"
                                    title={`Theme: ${album.bgColor}`}
                                >
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: album.bgColor }}></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListAlbum;
