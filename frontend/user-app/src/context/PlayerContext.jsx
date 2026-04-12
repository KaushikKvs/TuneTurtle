import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { API_BASE_URL } from "./AuthContext";

export const PlayerContext = createContext();
export const PlayerContextProvider = ({ children }) => {
  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
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
  const playWithId = async (id) => {
    songsData.map((item) => {
      if (id === item._id) {
        setTrack(item);
      }
    });
    await audioRef.current.play();
    setPlayStatus(true);
  };
  const previous = async () => {
    songsData.map(async (item, index) => {
      if (track._id === item._id && index > 0) {
        await setTrack(songsData[index - 1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
    });
  };
  const next = async () => {
    songsData.map(async (item, index) => {
      if (track._id === item._id && index < songsData.length - 1) {
        await setTrack(songsData[index + 1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
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
  };

  useEffect(() => {
    if (user && token) {
      getAlbumsData();
      getSongsData();
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
