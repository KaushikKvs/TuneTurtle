import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Upload, ImageIcon, Palette, Type, DollarSign } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

const AddAlbum = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [bgColor, setBgColor] = useState("#0B0B0C");
    const [price, setPrice] = useState("");
    const [isFree, setIsFree] = useState(false);
    const [loading, setLoading] = useState(false);
    const { getAuthHeaders } = useAuth();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!image) return toast.error("Album cover is required");

        setLoading(true);
        try {
            const formData = new FormData();
            const requestBody = {
                name,
                desc,
                bgColor,
                price: parseFloat(price || 0),
                isFree
            };

            formData.append("request", JSON.stringify(requestBody));
            formData.append("file", image);

            const response = await axios.post(`${API_BASE_URL}/api/albums`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.success) {
                toast.success("Album published successfully");
                setName("");
                setDesc("");
                setImage(null);
                setPrice("");
                setIsFree(false);
            }
        } catch (error) {
            toast.error("Failed to publish album");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Create Collection</h1>
                <p className="text-[var(--text-secondary)] mt-1 font-medium">Publish a new album or compilation to the platform</p>
            </div>

            <form onSubmit={onSubmitHandler} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Image Upload */}
                <div className="md:col-span-4 flex flex-col items-center">
                    <label 
                        htmlFor="image" 
                        className="w-full aspect-square bg-[var(--bg-surface)] border border-dashed border-[var(--border-subtle)] rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-hover)] hover:border-[var(--dashboard-accent)] transition-all group overflow-hidden shadow-sm"
                    >
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <div className="p-4 bg-[var(--dashboard-accent)]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-8 h-8 text-[var(--dashboard-accent)]" />
                                </div>
                                <span className="text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest">Upload Cover</span>
                                <span className="text-[10px] text-[var(--text-meta)] mt-1 font-medium">JPG, PNG (max 5MB)</span>
                            </>
                        )}
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
                    </label>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-8 space-y-6">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-8 space-y-6 shadow-xl shadow-black/5">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest mb-3 ml-1">
                                    <Type className="w-3 h-3 text-[var(--dashboard-accent)]" /> Album Title
                                </label>
                                <input 
                                    onChange={(e) => setName(e.target.value)} 
                                    value={name} 
                                    type="text" 
                                    placeholder="Enter album name" 
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--dashboard-accent)]/50 rounded-xl px-4 py-3 text-[var(--text-primary)] font-medium outline-none transition-all placeholder-[var(--text-meta)]/50"
                                    required 
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest mb-3 ml-1">
                                    <Type className="w-3 h-3 text-[var(--dashboard-accent)]" /> Description
                                </label>
                                <textarea 
                                    onChange={(e) => setDesc(e.target.value)} 
                                    value={desc} 
                                    placeholder="What's this album about?" 
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--dashboard-accent)]/50 rounded-xl px-4 py-3 text-[var(--text-primary)] font-medium outline-none transition-all min-h-[100px] placeholder-[var(--text-meta)]/50"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
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
                                        placeholder="299" 
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--dashboard-accent)]/50 rounded-xl px-4 py-3 text-[var(--text-primary)] font-bold outline-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        required={!isFree}
                                    />
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                        <input 
                                            type="checkbox" 
                                            id="isFree" 
                                            checked={isFree} 
                                            onChange={(e) => setIsFree(e.target.checked)}
                                            className="w-5 h-5 rounded-md border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--dashboard-accent)] accent-[var(--dashboard-accent)] cursor-pointer"
                                        />
                                        <label htmlFor="isFree" className="text-sm font-bold text-[var(--text-secondary)]">Mark Free</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-[var(--dashboard-accent)] hover:scale-[1.02] active:scale-95 text-[var(--bg-base)] font-black rounded-2xl shadow-xl shadow-[var(--accent-glow)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                                    <div className="w-4 h-4 border-2 border-[var(--bg-base)]/30 border-t-[var(--bg-base)] rounded-full animate-spin"></div>
                                    <span>Creating Collection...</span>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Publish Album
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddAlbum;
