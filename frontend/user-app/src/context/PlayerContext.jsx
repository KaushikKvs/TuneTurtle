import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { API_BASE_URL } from "./AuthContext";
import toast from "react-hot-toast";

export const PlayerContext = createContext();
export const PlayerContextProvider = ({ children }) => {
  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [purchasedSongIds, setPurchasedSongIds] = useState([]);
  const [purchasedAlbumIds, setPurchasedAlbumIds] = useState([]);
  const [expiryMap, setExpiryMap] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [pendingPlaybackIds, setPendingPlaybackIds] = useState(new Set());
  const { user, token, getAuthHeaders } = useAuth();

  // Songs playing bar states
  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const prevVolume = useRef(1);

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };
  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  /**
   * Unified Access Check (Backend-Enforced)
   * This is the ONLY source of truth for playback authorization.
   */
  const verifyAccess = async (contentId) => {
    if (!token) return { hasAccess: false, reason: 'NONE' };
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/access/check?contentId=${contentId}`, {
            headers: getAuthHeaders()
        });
        return data; 
    } catch (error) {
        console.error("Access verification failed", error);
        return { hasAccess: false, reason: 'NONE' };
    }
  };

  const addToCart = (item, type = "SONG") => {
    if (!item || (!item._id && !item.id)) return;
    const itemId = item._id || item.id;
    const itemName = item.name;
    const itemPrice = Number(item.price);
    const itemImage = item.image || item.imageUrl;

    if (item.isFree || !itemPrice || itemPrice <= 0) {
      toast("This item is free.");
      return;
    }

    if (mySubscriptions.includes(item.artistId)) {
        toast("You have Inner Circle access for this artist!");
        return;
    }

    if (type === "SONG") {
        if (purchasedSongIds.includes(itemId)) {
            toast("You already own this song.");
            return;
        }
        // Prevent adding song if its album is already in cart
        const isAlbumInCart = cartItems.some(ci => ci.type === "ALBUM" && ci.itemName === item.album);
        if (isAlbumInCart) {
            toast("Album already in cart. Songs are included!");
            return;
        }
    } else if (type === "ALBUM") {
        if (purchasedAlbumIds.includes(itemId)) {
            toast("You already own this album.");
            return;
        }
    }

    setCartItems((prev) => {
      // Deduplicate
      if (prev.some((ci) => ci.songId === itemId && ci.type === type)) {
        return prev;
      }

      let newCart = [...prev];

      // Mutual Exclusion Logic:
      if (type === "ALBUM") {
        // If adding an album, remove all individual songs from that album
        newCart = newCart.filter(ci => !(ci.type === "SONG" && ci.albumName === itemName));
      } else if (type === "SONG") {
        // If adding a song, and its album is in the cart, remove the album 
        // (as per user request: "selecting song should reset the album")
        newCart = newCart.filter(ci => !(ci.type === "ALBUM" && ci.itemName === item.album));
      }

      return [
        ...newCart,
        {
          songId: itemId, // Keeping key as songId for backward compatibility in DTO mapping
          songName: itemName,
          artistId: item.artistId,
          amountPaid: itemPrice,
          image: itemImage,
          desc: item.desc,
          type: type,
          albumName: item.album || itemName // Track album name for filtering
        }
      ];
    });
    toast.success(`${itemName} added to cart`);
  };

  const addAlbumToCart = (album, albumSongs) => {
      addToCart(album, "ALBUM");
  };

  const removeFromCart = (songId) => {
    setCartItems((prev) => prev.filter((item) => item.songId !== songId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const playWithId = async (id) => {
    if (pendingPlaybackIds.has(String(id))) {
        console.log("Playback attempt ignored: Already checking access for", id);
        return;
    }

    console.log("Attempting to play track:", id);
    const item = songsData.find(s => String(s.id) === String(id) || String(s._id) === String(id));
    
    if (!item) {
        console.error("Track not found in songsData:", id);
        return;
    }

    // Set lock
    setPendingPlaybackIds(prev => new Set(prev).add(String(id)));

    try {
        const access = await verifyAccess(item._id || item.id);
        
        if (!access.hasAccess) {
          if (access.isExpired) {
              toast.error("License Expired! Please renew to listen.");
          } else {
              toast.error("Premium track! Complete purchase or subscribe to listen.", { style: { background: '#333', color: '#fff' }});
          }
          return;
        }

        setTrack(item);
        setTimeout(() => {
          audioRef.current?.play();
          setPlayStatus(true);
        }, 50);
    } finally {
        // Release lock
        setPendingPlaybackIds(prev => {
            const next = new Set(prev);
            next.delete(String(id));
            return next;
        });
    }
  };

  const previous = async () => {
    const currentIndex = songsData.findIndex(item => item.id === track?.id || item._id === track?._id);
    if (currentIndex > 0) {
      const prevItem = songsData[currentIndex - 1];
      const access = await verifyAccess(prevItem._id || prevItem.id);
      
      if (!access.hasAccess) {
        toast.error("Previous track is premium. Complete purchase to listen.", { style: { background: '#333', color: '#fff' }});
        return;
      }
      setTrack(prevItem);
      setTimeout(() => {
        audioRef.current?.play();
        setPlayStatus(true);
      }, 50);
    }
  };

  const getNextTrack = () => {
    const currentIndex = songsData.findIndex(item => item.id === track?.id || item._id === track?._id);
    if (isShuffled) {
      // Pick a random track that isn't the current one
      const available = songsData.filter((_, i) => i !== currentIndex);
      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
    }
    if (currentIndex < songsData.length - 1 && currentIndex !== -1) {
      return songsData[currentIndex + 1];
    }
    // If at last track and repeat-all, loop to first
    if (repeatMode === 'all' && songsData.length > 0) {
      return songsData[0];
    }
    return null;
  };

  const next = async () => {
    const nextItem = getNextTrack();
    if (!nextItem) return;
    const access = await verifyAccess(nextItem._id || nextItem.id);
    if (!access.hasAccess) {
      toast.error("Next track is premium. Subscribe to listen.", { style: { background: '#333', color: '#fff' }});
      return;
    }
    setTrack(nextItem);
    setTimeout(() => {
      audioRef.current?.play();
      setPlayStatus(true);
    }, 50);
  };

  // Volume controls
  const changeVolume = (val) => {
    const v = Math.max(0, Math.min(1, val));
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      // Unmute: restore previous volume
      const restored = prevVolume.current || 0.5;
      setVolume(restored);
      if (audioRef.current) audioRef.current.volume = restored;
      setIsMuted(false);
    } else {
      // Mute: save current volume and set to 0
      prevVolume.current = volume;
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleShuffle = () => setIsShuffled(prev => !prev);

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };
  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/songs`, {
        headers: getAuthHeaders(),
      });
      const songs = response.data.songs || [];
      setSongsData(songs);
      if (songs.length > 0) {
        setTrack(songs[0]);
      }
    } catch (error) {
      console.error(error);
      setSongsData([]);
    }
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/albums`, {
        headers: getAuthHeaders(),
      });
      const albums = response.data.albums || [];
      setAlbumsData(albums);
    } catch (error) {
      console.error(error);
      setAlbumsData([]);
    }
  };

  const contextValue = {
    getSongsData,
    getAlbumsData,
    songsData,
    albumsData,
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    volume,
    changeVolume,
    isMuted,
    toggleMute,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    mySubscriptions,
    purchasedSongIds,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    setPurchasedSongIds,
    setSongsData,
    setAlbumsData,
    purchasedAlbumIds,
    expiryMap,
    addAlbumToCart,
    verifyAccess
  };

  const getSubscriptionsData = async () => {
    try {
      if (user) {
        const response = await axios.get(`${API_BASE_URL}/api/transactions/my-subscriptions`, {
          headers: getAuthHeaders(),
        });
        setMySubscriptions(response.data || []);
      }
    } catch (error) {
      console.error("Subs err:", error);
    }
  };

  const getOwnershipData = async () => {
    try {
      if (user) {
        const { data } = await axios.get(`${API_BASE_URL}/api/transactions/ownership`, {
        headers: getAuthHeaders(),
      });
      setPurchasedSongIds(data.songs || []);
      setPurchasedAlbumIds(data.albums || []);
      setMySubscriptions(data.subscriptions || []); // Mapping subscriptions if present
      setExpiryMap(data.expiryMap || {});
      }
    } catch (error) {
      console.error("Ownership err:", error);
    }
  };

  const getPurchasedSongsData = async () => {
      // Legacy - wrapped by getOwnershipData now
      getOwnershipData();
  };

  useEffect(() => {
    if (!user?.id) {
      setCartItems([]);
      return;
    }
    const savedCart = localStorage.getItem(`tuneturtle_cart_${user.id}`);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    localStorage.setItem(`tuneturtle_cart_${user.id}`, JSON.stringify(cartItems));
  }, [cartItems, user?.id]);

  useEffect(() => {
    if (user && token) {
      getAlbumsData();
      getSongsData();
      getSubscriptionsData();
      getPurchasedSongsData();
    }
  }, [user, token]);

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateSeekBar = () => {
      if (seekBar.current && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        seekBar.current.style.width = Math.floor(progress) + "%";
        setTime({
          currentTime: {
            second: Math.floor(audio.currentTime % 60),
            minute: Math.floor(audio.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audio.duration % 60) || 0,
            minute: Math.floor(audio.duration / 60) || 0,
          },
        });
      }
    };
    const handleLoadedMetadata = () => {
      if (seekBar.current) {
        seekBar.current.style.width = "0%";
      }
    };

    // Auto-advance when song ends
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    //add event listeners
    audio.addEventListener("timeupdate", updateSeekBar);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Sync volume to audio element
    audio.volume = volume;

    //cleanup function
    return () => {
      audio.removeEventListener("timeupdate", updateSeekBar);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [track, repeatMode, isShuffled, volume]);
  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};
