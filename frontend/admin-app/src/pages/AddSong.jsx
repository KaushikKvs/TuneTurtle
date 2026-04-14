import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Upload, Music, ImageIcon, Headset, Type, DollarSign, Database } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

const AddSong = () => {
    const [image, setImage] = useState(null);
    const [song, setSong] = useState(null);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [album, setAlbum] = useState("");
    const [price, setPrice] = useState("");
    const [isFree, setIsFree] = useState(false);
    const [albumData, setAlbumData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getAuthHeaders } = useAuth();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!image) return toast.error("Track thumbnail is required");
        if (!song) return toast.error("Audio file is required");

        setLoading(true);
        try {
            const formData = new FormData();
            const requestBody = {
                name,
                desc,
                album,
                price: parseFloat(price || 0),
                isFree,
                duration: "03:45" // Mock duration, backend would ideally handle this or we'd extract it
            };

            formData.append("request", JSON.stringify(requestBody));
            formData.append("imageFile", image);
            formData.append("audioFile", song);

            const response = await axios.post(`${API_BASE_URL}/api/songs`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.success) {
                toast.success("Track uploaded successfully");
                setName("");
                setDesc("");
                setAlbum("");
                setImage(null);
                setSong(null);
                setPrice("");
                setIsFree(false);
            }
        } catch (error) {
            toast.error("Failed to upload track");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadAlbums = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/albums`, {
                headers: getAuthHeaders()
            });
            if (response.data.success) {
                setAlbumData(response.data.albums);
            }
        } catch (error) {
            console.error("Failed to load albums", error);
        }
    };

    useEffect(() => {
        loadAlbums();
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Upload New Track</h1>
                <p className="text-[var(--text-secondary)] mt-1 font-medium">Publish high-quality audio files to the platform catalog</p>
            </div>

            <form onSubmit={onSubmitHandler} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* File Upload Section */}
                <div className="md:col-span-4 space-y-6">
                    <div>
                        <label className="text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest mb-3 block ml-1">Track Thumbnail</label>
                        <label 
                            htmlFor="image" 
                            className="w-full aspect-square bg-[var(--bg-surface)] border border-dashed border-[var(--border-subtle)] rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-hover)] hover:border-[var(--dashboard-accent)] transition-all group overflow-hidden shadow-sm"
                        >
                            {image ? (
                                <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="p-4 bg-[var(--dashboard-accent)]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-6 h-6 text-[var(--dashboard-accent)]" />
                                    </div>
                                    <span className="text-[10px] font-bold text-[var(--text-meta)] uppercase tracking-tighter">Click to Upload Cover</span>
                                </>
                            )}
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
                        </label>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest mb-3 block ml-1">Audio Source</label>
                        <label 
                            htmlFor="song" 
                            className="w-full p-8 bg-[var(--bg-surface)] border border-dashed border-[var(--border-subtle)] rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-hover)] hover:border-[var(--dashboard-accent)] transition-all group shadow-sm"
                        >
                            <div className="p-4 bg-[var(--dashboard-accent)]/10 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                                <Headset className="w-6 h-6 text-[var(--dashboard-accent)]" />
                            </div>
                            <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-tighter truncate w-full text-center px-4">
                                {song ? song.name : "Select HQ Audio File"}
                            </span>
                            <input onChange={(e) => setSong(e.target.files[0])} type="file" id="song" accept="audio/*" hidden />
                        </label>
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:col-span-8 space-y-6">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-8 space-y-6 shadow-xl shadow-black/5">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest mb-3 ml-1">
                                    <Music className="w-3 h-3 text-[var(--dashboard-accent)]" /> Track Name
                                </label>
                                <input 
                                    onChange={(e) => setName(e.target.value)} 
                                    value={name} 
                                    type="text" 
                                    placeholder="e.g. Moonlight Sonata pt. 1" 
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--dashboard-accent)]/50 rounded-xl px-4 py-3 text-[var(--text-primary)] font-medium outline-none transition-all placeholder-[var(--text-meta)]/50"
                                    required 
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest mb-3 ml-1">
                                    <Type className="w-3 h-3 text-[var(--dashboard-accent)]" /> Metadata / Genre
                                </label>
                                <textarea 
                                    onChange={(e) => setDesc(e.target.value)} 
                                    value={desc} 
                                    placeholder="Alternative, Rock, High Quality 24-bit..." 
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--dashboard-accent)]/50 rounded-xl px-4 py-3 text-[var(--text-primary)] font-medium outline-none transition-all min-h-[80px] placeholder-[var(--text-meta)]/50"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest mb-3 ml-1">
                                    <Database className="w-3 h-3 text-[var(--dashboard-accent)]" /> Link to Collection
                                </label>
                                <select 
                                    onChange={(e) => setAlbum(e.target.value)} 
                                    value={album}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--dashboard-accent)]/50 rounded-xl px-4 py-3 text-[var(--text-primary)] font-bold outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled className="bg-[var(--bg-surface)] text-[var(--text-meta)]">Select an Album</option>
                                    <option value="none" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">None (Single)</option>
                                    {albumData.map((item) => (
                                        <option key={item.id || item._id} value={item.name} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest mb-3 ml-1">
                                    <DollarSign className="w-3 h-3 text-[var(--dashboard-accent)]" /> Pricing (₹)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        onChange={(e) => setPrice(e.target.value)} 
                                        value={price} 
                                        disabled={isFree}
                                        type="number" 
                                        placeholder="49" 
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--dashboard-accent)]/50 rounded-xl px-4 py-3 text-[var(--text-primary)] font-bold outline-none transition-all disabled:opacity-30"
                                        required={!isFree}
                                    />
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                        <input 
                                            type="checkbox" 
                                            id="isSongFree" 
                                            checked={isFree} 
                                            onChange={(e) => setIsFree(e.target.checked)}
                                            className="w-5 h-5 rounded-md border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--dashboard-accent)] accent-[var(--dashboard-accent)] cursor-pointer"
                                        />
                                        <label htmlFor="isSongFree" className="text-sm font-bold text-[var(--text-secondary)]">Free</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-[var(--dashboard-accent)] hover:scale-[1.02] active:scale-95 text-[var(--bg-base)] font-black rounded-2xl shadow-xl shadow-[var(--accent-glow)] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                                    <div className="w-4 h-4 border-2 border-[var(--bg-base)]/30 border-t-[var(--bg-base)] rounded-full animate-spin"></div>
                                    <span>Syncing Media...</span>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Publish High-Res Track
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddSong;
