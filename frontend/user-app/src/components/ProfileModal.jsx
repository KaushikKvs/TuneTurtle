import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, User, Music, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

const ProfileModal = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    artistName: "",
    genre: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success("Profile Updated Holographically!", { icon: "✨", style: { background: "var(--bg-surface)", color: "var(--text-primary)" }});
      onClose();
    } else {
      toast.error(res.message, { style: { background: "var(--bg-surface)", color: "var(--text-primary)" }});
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="premium-tracer w-full max-w-md bg-[var(--bg-surface)]/90 backdrop-blur-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up border border-[var(--border-subtle)]">
        
        {/* Header */}
        <div className="relative border-b border-[var(--border-subtle)] px-6 py-4 flex justify-between items-center bg-[var(--bg-base)]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent)]/10 rounded-xl">
              <User className="w-5 h-5 text-[var(--accent)] shadow-[var(--accent-glow)] drop-shadow-md" />
            </div>
            <div>
                <h2 className="text-xl font-bold tracking-tighter text-[var(--text-primary)]">Profile Configuration</h2>
                <p className="text-xs text-[var(--accent)] font-mono uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-hover)] text-[var(--text-meta)] hover:text-[var(--text-primary)] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Artist Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              <User className="w-4 h-4 text-[var(--text-meta)]" /> Artist Moniker
            </label>
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              placeholder="e.g. DJ Turtle"
              className="w-full bg-[var(--bg-base)] text-sm text-[var(--text-primary)] placeholder-[var(--text-meta)] border border-[var(--border-subtle)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all shadow-inner"
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              <Music className="w-4 h-4 text-[var(--text-meta)]" /> Core Genre
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="e.g. Cyberpunk Synthwave"
              className="w-full bg-[var(--bg-base)] text-sm text-[var(--text-primary)] placeholder-[var(--text-meta)] border border-[var(--border-subtle)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all shadow-inner"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              <Edit3 className="w-4 h-4 text-[var(--text-meta)]" /> Public Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Inject your soundscape manifesto here..."
              rows={3}
              className="w-full bg-[var(--bg-base)] text-sm text-[var(--text-primary)] placeholder-[var(--text-meta)] border border-[var(--border-subtle)] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all resize-none shadow-inner"
            />
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative overflow-hidden bg-[var(--accent)] hover:bg-opacity-90 text-[var(--bg-base)] font-bold py-3.5 rounded-xl shadow-[0_0_20px_var(--accent-glow)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                 {isSubmitting ? "Uplinking Data..." : "Engage Profile Updates"} 
              </div>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProfileModal;
