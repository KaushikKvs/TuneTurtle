import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth, API_BASE_URL } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Upload, DollarSign, ListMusic, Trash2 } from "lucide-react";

const Dashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "earnings");

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab) setTab(currentTab);
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
  };
  const [earnings, setEarnings] = useState({ totalEarnings: 0, thisMonthEarnings: 0, totalSales: 0 });
  const [uploadForm, setUploadForm] = useState({ name: "", desc: "", bgColor: "#121212", price: "", isFree: false });
  const [trackForm, setTrackForm] = useState({ name: "", desc: "", album: "", price: "", isFree: false });
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myAlbums, setMyAlbums] = useState([]);
  const [mySongs, setMySongs] = useState([]);

  useEffect(() => {
    if (user?.role === "ARTIST") {
      fetchEarnings();
    }
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/transactions/earnings`, { headers: getAuthHeaders() });
      setEarnings(data);
    } catch (error) {
      console.error("Earnings fetch error:", error);
    }
  };

  const fetchMyAlbums = async () => {
    if (!user?.id) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/albums?artistId=${user.id}`, {
        headers: getAuthHeaders()
      });
      if (data.success && data.albums) {
        setMyAlbums(data.albums);
      }
    } catch (error) {
      console.error("Albums fetch error:", error);
    }
  };

  const fetchMySongs = async () => {
    if (!user?.id) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/songs?artistId=${user.id}`, {
        headers: getAuthHeaders()
      });
      if (data.success && data.songs) {
        setMySongs(data.songs);
      }
    } catch (error) {
      console.error("Songs fetch error:", error);
    }
  };

  useEffect(() => {
    if (tab === "upload_track" || tab === "upload" || tab === "my_songs") {
      fetchMyAlbums();
    }
    if (tab === "my_songs") {
        fetchMySongs();
    }
  }, [tab, user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Cover image is required");
    
    const formData = new FormData();
    const reqObj = { ...uploadForm, price: parseFloat(uploadForm.price || 0) };
    formData.append("request", JSON.stringify(reqObj));
    formData.append("file", imageFile);

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/albums`, formData, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" }
      });
      toast.success("Album successfully uploaded!");
      setUploadForm({ name: "", desc: "", bgColor: "#121212", price: "", isFree: false });
      setImageFile(null);
      fetchMyAlbums(); // Refresh albums
    } catch (error) {
      toast.error("Upload failed: " + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const handleTrackUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Track thumbnail is required");
    if (!audioFile) return toast.error("High Quality Audio File is required");
    if (!trackForm.album) return toast.error("Please select an album");

    const formData = new FormData();
    const reqObj = { ...trackForm, price: parseFloat(trackForm.price || 0) };
    formData.append("request", JSON.stringify(reqObj));
    formData.append("image", imageFile);
    formData.append("audio", audioFile);

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/songs`, formData, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" }
      });
      toast.success("Track successfully uploaded!");
      setTrackForm({ name: "", desc: "", album: "", price: "", isFree: false });
      setImageFile(null);
      setAudioFile(null);
    } catch (error) {
      toast.error("Upload failed: " + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const handleDeleteSong = async (id) => {
    if (!window.confirm("Are you sure you want to delete this track?")) return;
    try {
        await axios.delete(`${API_BASE_URL}/api/songs/${id}`, {
            headers: getAuthHeaders()
        });
        toast.success("Song deleted");
        fetchMySongs();
    } catch (error) {
        toast.error("Delete failed");
    }
  };

  if (user?.role !== "ARTIST") {
    return <div className="p-8 text-[var(--text-primary)] text-center">Only artists can access the dashboard.</div>;
  }

  return (
    <div className="p-8 bg-[var(--bg-base)] min-h-screen text-[var(--text-primary)]">
      <h1 className="text-3xl font-bold mb-8">Artist Dashboard</h1>
      <div className="flex gap-8">
        <div className="w-56 flex flex-col gap-2">
          <button onClick={() => handleTabChange("earnings")} className={`p-3 text-left rounded-lg flex items-center gap-2 transition ${tab === "earnings" ? "bg-[var(--dashboard-accent)]/10 border border-[var(--dashboard-accent)] text-[var(--dashboard-accent)]" : "hover:bg-[var(--bg-hover)]"}`}>
            <DollarSign className="w-4 h-4" /> Earnings Overview
          </button>
          <button onClick={() => handleTabChange("upload")} className={`p-3 text-left rounded-lg flex items-center gap-2 transition ${tab === "upload" ? "bg-[var(--dashboard-accent)]/10 border border-[var(--dashboard-accent)] text-[var(--dashboard-accent)]" : "hover:bg-[var(--bg-hover)]"}`}>
            <Upload className="w-4 h-4" /> Create Release (Album)
          </button>
          <button onClick={() => handleTabChange("upload_track")} className={`p-3 text-left rounded-lg flex items-center gap-2 transition ${tab === "upload_track" ? "bg-[var(--dashboard-accent)]/10 border border-[var(--dashboard-accent)] text-[var(--dashboard-accent)]" : "hover:bg-[var(--bg-hover)]"}`}>
            <ListMusic className="w-4 h-4" /> Upload Track
          </button>
          <button onClick={() => handleTabChange("my_songs")} className={`p-3 text-left rounded-lg flex items-center gap-2 transition ${tab === "my_songs" ? "bg-[var(--dashboard-accent)]/10 border border-[var(--dashboard-accent)] text-[var(--dashboard-accent)]" : "hover:bg-[var(--bg-hover)]"}`}>
            <ListMusic className="w-4 h-4" /> My Music
          </button>
        </div>
        
        <div className="flex-1 bg-[var(--bg-surface)] rounded-xl p-6 border border-[var(--border-subtle)]">
          {tab === "earnings" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Earnings Overview</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[var(--bg-card)] p-6 rounded-lg text-center border border-[var(--border-subtle)]">
                  <div className="text-3xl font-bold text-[var(--dashboard-accent)]">₹{earnings.thisMonthEarnings.toFixed(2)}</div>
                  <div className="text-[var(--text-secondary)] text-sm mt-1">This month</div>
                </div>
                <div className="bg-[var(--bg-card)] p-6 rounded-lg text-center border border-[var(--border-subtle)]">
                  <div className="text-3xl font-bold text-[var(--dashboard-accent)]">₹{earnings.totalEarnings.toFixed(2)}</div>
                  <div className="text-[var(--text-secondary)] text-sm mt-1">Total earned</div>
                </div>
                <div className="bg-[var(--bg-card)] p-6 rounded-lg text-center border border-[var(--border-subtle)]">
                  <div className="text-3xl font-bold text-[var(--dashboard-accent)]">{earnings.totalSales}</div>
                  <div className="text-[var(--text-secondary)] text-sm mt-1">Total sales</div>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Payouts are processed securely. The platform retains a 15% maintenance logic fee per transaction.</p>
            </div>
          )}

          {tab === "upload" && (
            <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
              <h2 className="text-xl font-semibold mb-6">Publish New Release</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Album Title</label>
                <input required type="text" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded p-2 text-[var(--text-primary)]" value={uploadForm.name} onChange={e => setUploadForm({...uploadForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description / Genre</label>
                <input required type="text" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded p-2 text-[var(--text-primary)]" value={uploadForm.desc} onChange={e => setUploadForm({...uploadForm, desc: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pricing (₹)</label>
                  <input type="number" min="0" disabled={uploadForm.isFree} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded p-2 text-[var(--text-primary)] disabled:opacity-50" placeholder="e.g. 299" value={uploadForm.price} onChange={e => setUploadForm({...uploadForm, price: e.target.value})} />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" id="isFree" checked={uploadForm.isFree} onChange={e => setUploadForm({...uploadForm, isFree: e.target.checked})} className="w-4 h-4 accent-[var(--accent)]" />
                  <label htmlFor="isFree">Make it Free</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input type="color" className="w-16 h-10 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded p-1 cursor-pointer" value={uploadForm.bgColor} onChange={e => setUploadForm({...uploadForm, bgColor: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">Cover Image</label>
                <label 
                  htmlFor="image-upload-album"
                  className="w-full flex items-center gap-4 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-4 cursor-pointer hover:border-[var(--dashboard-accent)] transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 bg-[var(--dashboard-accent)]/10 text-[var(--dashboard-accent)] rounded-lg flex items-center justify-center group-hover:bg-[var(--dashboard-accent)]/20 transition-colors">
                    <Upload className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                        {imageFile ? imageFile.name : "Choose High-Res Cover Image"}
                    </p>
                    <p className="text-[10px] text-[var(--text-meta)] uppercase tracking-wider">Supports: JPG, PNG, WEBP</p>
                  </div>
                </label>
                <input 
                  id="image-upload-album"
                  required 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={e => setImageFile(e.target.files[0])} 
                />
              </div>
              <button disabled={loading} type="submit" className="mt-6 px-10 py-3 bg-[var(--dashboard-accent)] text-[var(--bg-base)] font-bold rounded-full hover:scale-105 transition-all shadow-xl shadow-[var(--accent-glow)] disabled:opacity-50">
                {loading ? "Publishing..." : "Publish Release"}
              </button>
            </form>
          )}

          {tab === "upload_track" && (
            <form onSubmit={handleTrackUpload} className="space-y-6 max-w-xl">
              <h2 className="text-xl font-semibold mb-6">Upload High Quality Track</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Album</label>
                  <select required className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-3 text-[var(--text-primary)] outline-none focus:border-[var(--dashboard-accent)] transition-colors appearance-none" value={trackForm.album} onChange={e => setTrackForm({...trackForm, album: e.target.value})}>
                    <option value="" disabled className="bg-[var(--bg-surface)]">Choose an album...</option>
                    {myAlbums.map(album => (
                      <option key={album.id || album._id} value={album.name} className="bg-[var(--bg-surface)]">{album.name}</option>
                    ))}
                  </select>
                  {myAlbums.length === 0 && <p className="text-red-400 text-xs mt-1">You must create a Release (Album) first.</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Track Title</label>
                    <input required type="text" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-3 text-[var(--text-primary)] outline-none focus:border-[var(--dashboard-accent)] transition-colors" placeholder="e.g. My Magnum Opus" value={trackForm.name} onChange={e => setTrackForm({...trackForm, name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Track Description</label>
                <input required type="text" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-3 text-[var(--text-primary)] outline-none focus:border-[var(--dashboard-accent)] transition-colors" placeholder="Briefly describe your track history/vibe" value={trackForm.desc} onChange={e => setTrackForm({...trackForm, desc: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pricing (₹)</label>
                  <input type="number" min="0" disabled={trackForm.isFree} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-3 text-[var(--text-primary)] disabled:opacity-50" placeholder="e.g. 49" value={trackForm.price} onChange={e => setTrackForm({...trackForm, price: e.target.value})} />
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <input type="checkbox" id="isTrackFree" checked={trackForm.isFree} onChange={e => setTrackForm({...trackForm, isFree: e.target.checked})} className="w-5 h-5 accent-[var(--accent)] cursor-pointer" />
                  <label htmlFor="isTrackFree" className="text-sm font-medium cursor-pointer">Make Track Free</label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">Track Thumbnail</label>
                    <label 
                      htmlFor="image-upload-track"
                      className="flex items-center gap-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-3 cursor-pointer hover:border-[var(--dashboard-accent)] transition-all group shadow-sm"
                    >
                      <div className="w-8 h-8 bg-[var(--dashboard-accent)]/10 text-[var(--dashboard-accent)] rounded-lg flex items-center justify-center group-hover:bg-[var(--dashboard-accent)]/20 transition-colors flex-shrink-0">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold truncate">
                          {imageFile ? imageFile.name : "Select Image"}
                      </p>
                    </label>
                    <input 
                      id="image-upload-track"
                      required 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => setImageFile(e.target.files[0])} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Audio File</label>
                    <label 
                      htmlFor="audio-upload-track"
                      className="flex items-center gap-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-3 cursor-pointer hover:border-blue-500 transition-all group shadow-sm"
                    >
                      <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                        <ListMusic className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold truncate">
                          {audioFile ? audioFile.name : "Select Audio"}
                      </p>
                    </label>
                    <input 
                      id="audio-upload-track"
                      required 
                      type="file" 
                      accept="audio/*" 
                      className="hidden" 
                      onChange={e => setAudioFile(e.target.files[0])} 
                    />
                  </div>
              </div>

              <button disabled={loading || myAlbums.length === 0} type="submit" className="mt-6 w-full px-6 py-4 bg-[var(--dashboard-accent)] text-[var(--bg-base)] font-bold rounded-full hover:scale-[1.02] transition-all shadow-xl shadow-[var(--accent-glow)] disabled:opacity-50">
                {loading ? "Processing High-Quality Upload..." : "Upload Track to Marketplace"}
              </button>
            </form>
          )}

          {tab === "my_songs" && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">My Music Catalog</h2>
                    <p className="text-sm text-[var(--text-secondary)]">{mySongs.length} Tracks uploaded</p>
                </div>
                <div className="space-y-3">
                    {mySongs.map((song) => (
                        <div key={song.id || song._id} className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-subtle)] group hover:border-[var(--dashboard-accent)]/30 transition-all">
                            <img src={song.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold truncate">{song.name}</h3>
                                <p className="text-xs text-[var(--text-secondary)] truncate">{song.album} • {song.duration}</p>
                            </div>
                            <div className="text-right px-4">
                                <p className="text-sm font-bold text-[var(--dashboard-accent)]">{song.isFree ? "Free" : `₹${song.price}`}</p>
                            </div>
                            <button 
                                onClick={() => handleDeleteSong(song.id || song._id)}
                                className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                                title="Delete Track"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {mySongs.length === 0 && (
                        <div className="text-center py-12 bg-[var(--bg-card)]/50 rounded-xl border border-dashed border-[var(--border-subtle)]">
                            <p className="text-[var(--text-secondary)]">You haven't uploaded any tracks yet.</p>
                            <button onClick={() => handleTabChange("upload_track")} className="text-[var(--dashboard-accent)] text-sm font-bold mt-2">Upload your first song</button>
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
