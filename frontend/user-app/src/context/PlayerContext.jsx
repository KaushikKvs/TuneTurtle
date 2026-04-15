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
  const checkAuthorization = (item) => {
    if (!item) return false;
    if (item.isFree !== false || !item.price || item.price === 0) return true; // Free
    if (user?.role === 'ADMIN' || item.artistId === user?.id) return true; // Admin or Owner
    return mySubscriptions.includes(item.artistId);
  };

  const playWithId = async (id) => {
    const item = songsData.find(s => s.id === id || s._id === id);
    if (!item) return;

    if (!checkAuthorization(item)) {
      toast.error("Premium track! Subscribe to the artist to listen.", { style: { background: '#333', color: '#fff' }});
      return;
    }

    setTrack(item);
    setTimeout(() => {
      audioRef.current?.play();
      setPlayStatus(true);
    }, 50);
  };

  const previous = async () => {
    const currentIndex = songsData.findIndex(item => item.id === track?.id || item._id === track?._id);
    if (currentIndex > 0) {
      const prevItem = songsData[currentIndex - 1];
      if (!checkAuthorization(prevItem)) {
        toast.error("Previous track is premium. Subscribe to listen.", { style: { background: '#333', color: '#fff' }});
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
    if (!checkAuthorization(nextItem)) {
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

  useEffect(() => {
    if (user && token) {
      getAlbumsData();
      getSongsData();
      getSubscriptionsData();
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
            second: Math.floor(audio.currentTime % 60),
            minute: Math.floor(audio.currentTime / 60),
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
