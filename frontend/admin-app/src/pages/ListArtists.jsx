import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Trash2, Users, Mail, ShieldAlert, RefreshCw, MessageSquare } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

const ListArtists = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAuthHeaders } = useAuth();

    const fetchArtists = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/artists`, {
                headers: getAuthHeaders()
            });
            setArtists(response.data);
        } catch (error) {
            toast.error("Failed to fetch artists");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`CRITICAL ACTION: Are you sure you want to PERMANENTLY remove the artist "${name}"? All their tracks and albums will remain but will be orphaned.`)) return;
        
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
                headers: getAuthHeaders()
            });
            if (response.data.success) {
                toast.success(`Artist ${name} removed from platform`);
                setArtists(artists.filter(a => a.id !== id));
            }
        } catch (error) {
            toast.error(error.response?.data || "Failed to remove artist");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-[var(--dashboard-accent)]" /> Creator Moderation
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1 font-medium italic opacity-80 uppercase text-[10px] tracking-widest">Platform Administration Control Center</p>
                </div>
                <button 
                    onClick={fetchArtists}
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
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest">Artist Detail</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-center">Genre</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-center">Account Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest text-right">Moderator Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {artists.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-24 text-center text-[var(--text-meta)]">
                                        <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-5" />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">No creators managed yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                artists.map((artist) => (
                                    <tr key={artist.id} className="hover:bg-[var(--bg-base)]/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--dashboard-accent)]/10 flex items-center justify-center border border-[var(--dashboard-accent)]/10 group-hover:scale-110 transition-transform shadow-sm">
                                                    <Users className="w-5 h-5 text-[var(--dashboard-accent)]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-[var(--text-primary)] truncate tracking-tight">{artist.artistName}</p>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium">
                                                        <Mail className="w-3 h-3 text-[var(--dashboard-accent)]/70" /> {artist.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 bg-[var(--bg-base)] rounded-full text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest border border-[var(--border-subtle)]">
                                                {artist.genre || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent-glow)]"></div> Active
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    className="p-2 text-[var(--text-meta)] hover:text-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)]/10 rounded-lg transition-all"
                                                    title="Send Message"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(artist.id, artist.artistName)}
                                                    className="p-2 text-[var(--text-meta)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Remove Artist"
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
            
            <div className="bg-[var(--dashboard-accent)]/5 border border-[var(--dashboard-accent)]/10 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <ShieldAlert className="w-6 h-6 text-[var(--dashboard-accent)] mt-0.5 flex-shrink-0" />
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    <p className="font-black text-[var(--dashboard-accent)] mb-1 uppercase tracking-widest">Moderator Disclosure & Policy:</p>
                    Removing an artist will revoke their access to the TuneTurtle command center. Their published works (songs/albums) will remain in the database but will no longer be associated with an active account. For disputes, use the messaging tool before taking permanent action.
                </div>
            </div>
        </div>
    );
};

export default ListArtists;
