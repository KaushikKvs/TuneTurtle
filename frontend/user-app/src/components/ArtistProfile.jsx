import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserCircle, BadgeCheck, Music, CheckCircle, Disc, ShoppingCart, PlayCircle, Star, Users } from "lucide-react";
import toast from "react-hot-toast";
import { PlayerContext } from "../context/PlayerContext";
import { API_BASE_URL, useAuth } from "../context/AuthContext";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";

const ArtistProfile = () => {
  const { id } = useParams();
  const { user, getAuthHeaders } = useAuth();
  const { albumsData, songsData, playWithId } = useContext(PlayerContext);
  const navigate = useNavigate();
  
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        // Fetch the list of artists to find the metadata for this specific ID
        const { data } = await axios.get(`${API_BASE_URL}/api/users/artists`);
        if (Array.isArray(data)) {
          const found = data.find(a => a.id === id || a._id === id);
          setArtist(found);
        }
        
        if (user) {
          try {
            const subRes = await axios.get(`${API_BASE_URL}/api/transactions/my-subscriptions`, { headers: getAuthHeaders() });
            if (subRes.data && subRes.data.includes(id)) {
              setIsSubscribed(true);
            }
          } catch (e) {
            console.log("Subscription status check failed (possibly no transactions yet)");
          }
        }
      } catch (error) {
        console.error("Fetch artist err:", error);
        toast.error("Failed to load artist metadata");
      }
      setLoading(false);
    };
    
    if (id) fetchArtistData();
  }, [id, user, API_BASE_URL]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stripeSessionId = params.get("stripe_session_id");
    const paymentStatus = params.get("payment");

    if (paymentStatus === "cancelled") {
      toast("Payment cancelled.");
      return;
    }

    if (!stripeSessionId || !user || isSubscribed) {
      return;
    }

    const confirmSession = async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/transactions/stripe/confirm-session`,
          { sessionId: stripeSessionId },
          { headers: getAuthHeaders() }
        );
        setIsSubscribed(true);
        toast.success(`Welcome to ${artist?.artistName || "the"} Inner Circle!`);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        toast.error("Payment could not be verified.");
      }
    };

    confirmSession();
  }, [user, isSubscribed, API_BASE_URL, getAuthHeaders, artist]);

  // Filter content belonging to this artist
  // We match by artistName or artistId if available in the data objects
  const artistAlbums = albumsData.filter(album => 
    album.artist === artist?.artistName || album.artistId === id
  );
  
  const artistSongs = songsData.filter(song => 
    song.artist === artist?.artistName || song.artistId === id
  );

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }
    setCheckingOut(true);
    try {
      const transactionDetails = {
        artistId: id,
        type: "SUBSCRIPTION",
        amountPaid: 299.0
      };
      const currentUrl = `${window.location.origin}/artist/${id}`;
      const { data: sessionData } = await axios.post(
        `${API_BASE_URL}/api/transactions/stripe/create-checkout-session`,
        {
          transactionDetails,
          successUrl: `${currentUrl}?stripe_session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${currentUrl}?payment=cancelled`
        },
        { headers: getAuthHeaders() }
      );

      if (!sessionData?.url) {
        throw new Error("Stripe checkout URL not received");
      }

      window.location.href = sessionData.url;

    } catch (error) {
      toast.error("Checkout failed: " + (error.response?.data?.message || "Internal Server Error"));
    }
    setCheckingOut(false);
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <Disc className="w-12 h-12 text-[var(--accent)] animate-spin" />
            <p className="text-[var(--text-meta)] font-bold animate-pulse">Syncing with Marketplace...</p>
        </div>
    </div>
  );
  
  if (!artist) return (
    <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Disc className="w-20 h-20 text-[var(--text-meta)] mb-6 opacity-10" />
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">Artist not found</h1>
        <p className="text-[var(--text-secondary)] mt-2 mb-8">This creator might have moved or updated their profile.</p>
        <button 
            onClick={() => navigate("/artists")} 
            className="px-8 py-3 bg-[var(--accent)] text-[var(--bg-base)] font-bold rounded-full hover:scale-105 transition-all shadow-xl"
        >
            Explore Directory
        </button>
    </div>
  );

  return (
    <div className="bg-transparent min-h-screen pb-20 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="relative h-[45vh] min-h-[350px] overflow-hidden rounded-[2.5rem] mt-6 group">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-hover)] via-transparent to-transparent z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-10 px-12 h-full pb-12">
          {/* Profile Image with Ring */}
          <div className="relative group/img">
            <div className="w-52 h-52 md:w-64 md:h-64 rounded-full border-[10px] border-[var(--bg-surface)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden bg-[var(--bg-base)] flex items-center justify-center transition-transform duration-500 group-hover/img:scale-[1.02]">
                <UserCircle className="w-3/4 h-3/4 text-[var(--text-meta)] opacity-40" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <Star className="text-white w-10 h-10 fill-white" />
                </div>
            </div>
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20">
                    <BadgeCheck className="w-4 h-4 fill-blue-500/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Marketplace Creator</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full border border-[var(--accent)]/20">
                    <Users className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Premium Artist</span>
                </div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-[var(--text-primary)] mb-6 leading-[0.8] drop-shadow-2xl">
              {artist.artistName}
            </h1>
            
            <p className="text-[var(--text-secondary)] text-xl max-w-2xl font-medium leading-relaxed italic opacity-80">
              "{artist.bio || `Exploring the boundaries of ${artist.genre || 'Sound'} for the TuneTurtle marketplace.`}"
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 mt-16 space-y-24">
        {/* Main Grid */}
        <div className="flex flex-col xl:flex-row gap-16">
            {/* Discography Section */}
            <div className="flex-1 space-y-10">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-6">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                        <Disc className="w-8 h-8 text-[var(--accent)]" /> 
                        Marketplace Discography
                    </h2>
                    <div className="px-4 py-1.5 bg-[var(--bg-hover)] rounded-full text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest border border-[var(--border-subtle)]">
                        {artistAlbums.length} Digital Releases
                    </div>
                </div>

                {artistAlbums.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
                        {artistAlbums.map((item, index) => (
                            <AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.imageUrl} />
                        ))}
                    </div>
                ) : (
                    <div className="p-20 rounded-[2rem] bg-[var(--bg-hover)] border-2 border-dashed border-[var(--border-subtle)] text-center group/empty">
                        <Disc className="w-12 h-12 text-[var(--text-meta)] mx-auto mb-4 opacity-20 group-hover/empty:rotate-180 transition-transform duration-1000" />
                        <p className="text-[var(--text-meta)] font-bold text-lg">No digital albums listed yet.</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Check back soon for new marketplace drops.</p>
                    </div>
                )}
            </div>

            {/* Support Sidebar */}
            <div className="w-full xl:w-96 space-y-8">
                <h2 className="text-3xl font-black tracking-tight">Support Artist</h2>
                <div className="bg-[var(--bg-surface)] p-8 rounded-[2rem] border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden group/card transition-all hover:shadow-[var(--accent-glow)]/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover/card:scale-150 duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl">
                                <PlayCircle className="w-6 h-6 text-[var(--accent)]" /> 
                            </div>
                            <h3 className="text-xl font-black">Artist Pass</h3>
                        </div>

                        <p className="text-[var(--text-secondary)] mb-8 font-medium leading-relaxed">
                            Gain lifetime access to high-fidelity streaming and exclusive digital downloads for {artist.artistName}'s entire catalog.
                        </p>
                        
                        {isSubscribed ? (
                            <div className="p-5 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl flex items-center justify-center gap-3 text-[var(--accent)] font-black text-center animate-in zoom-in duration-300">
                                <CheckCircle className="w-5 h-5 fill-[var(--accent)] text-[var(--bg-base)]" />
                                Subscribed to Inner Circle
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-[var(--text-primary)]">₹299</span>
                                    <span className="text-[var(--text-meta)] text-xs font-bold uppercase tracking-widest">/ ONE TIME ACCESS</span>
                                </div>
                                <button 
                                    onClick={handleSubscribe}
                                    disabled={checkingOut}
                                    className="w-full bg-[var(--accent)] text-[var(--bg-base)] font-black py-4 rounded-2xl hover:scale-[1.02] transition-all shadow-xl hover:shadow-[var(--accent-glow)] active:scale-95 disabled:opacity-50 ring-offset-4 ring-offset-[var(--bg-base)] focus:ring-4 focus:ring-[var(--accent)]/50"
                                >
                                    {checkingOut ? "Securing Transaction..." : "Join Inner Circle"}
                                </button>
                                <p className="text-[10px] text-center text-[var(--text-meta)] font-bold uppercase tracking-widest opacity-50">
                                    100% SECURE CHECKOUT • DIRECT ARTIST SUPPORT
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Tracks Section */}
        <div className="pb-32">
            <div className="flex items-center justify-between mb-10 border-b border-[var(--border-subtle)] pb-6">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                    <Music className="w-8 h-8 text-[var(--accent)]" /> 
                    Popular Marketplace Tracks
                </h2>
                <span className="text-xs font-bold text-[var(--text-meta)] uppercase tracking-widest opacity-40">{artistSongs.length} Digital Assets</span>
            </div>
            
            {artistSongs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artistSongs.map((item, index) => (
                        <SongItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} price={item.price} isFree={item.isFree} artistId={item.artistId || id} />
                    ))}
                </div>
            ) : (
                <div className="p-20 rounded-[2rem] bg-[var(--bg-hover)] border-2 border-dashed border-[var(--border-subtle)] text-center">
                    <p className="text-[var(--text-meta)] font-bold text-lg">No individual tracks available for purchase.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
