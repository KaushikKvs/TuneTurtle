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

  const next = async () => {
    const currentIndex = songsData.findIndex(item => item.id === track?.id || item._id === track?._id);
    if (currentIndex < songsData.length - 1 && currentIndex !== -1) {
      const nextItem = songsData[currentIndex + 1];
      if (!checkAuthorization(nextItem)) {
        toast.error("Next track is premium. Subscribe to listen.", { style: { background: '#333', color: '#fff' }});
        return;
      }
      setTrack(nextItem);
      setTimeout(() => {
        audioRef.current?.play();
        setPlayStatus(true);
      }, 50);
    }
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

    //add event listeners
    audio.addEventListener("timeupdate", updateSeekBar);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    //cleanup function

    return () => {
      audio.removeEventListener("timeupdate", updateSeekBar);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [track]);
  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};
