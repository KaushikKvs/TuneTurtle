import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import {
  ListMusic,
  Maximize2,
  Mic,
  Minimize2,
  Volume2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Speaker,
} from "lucide-react";

const Player = () => {
  const {
    track,
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    time,
    previous,
    next,
    seekSong,
  } = useContext(PlayerContext);
  return track ? (
    <div className="h-[12%] bg-[var(--bg-surface)] flex justify-between items-center text-[var(--text-primary)] px-6 border-t border-[var(--border-subtle)] shadow-2xl z-50">
      <div className="hidden lg:flex items-center gap-5 w-1/4">
        <img src={track.image} alt="" className="w-14 h-14 rounded-xl shadow-lg object-cover" />
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{track.name}</p>
          <p className="text-[11px] text-[var(--text-secondary)] truncate">{track.desc}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[600px]">
        <div className="flex gap-8 items-center">
          <Shuffle className="w-4 h-4 cursor-pointer text-[var(--text-meta)] hover:text-[var(--accent)] transition-colors" />
          <SkipBack
            onClick={previous}
            className="w-5 h-5 cursor-pointer text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
          />
          {playStatus ? (
            <div onClick={pause} className="w-10 h-10 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-base)] rounded-full hover:scale-110 transition-all cursor-pointer shadow-lg hover:shadow-[var(--accent-glow)]">
                <Pause className="w-5 h-5 fill-current" />
            </div>
          ) : (
            <div onClick={play} className="w-10 h-10 flex items-center justify-center bg-[var(--accent)] text-white rounded-full hover:scale-110 transition-all cursor-pointer shadow-lg shadow-[var(--accent-glow)]">
                <Play className="w-5 h-5 fill-current ml-1" />
            </div>
          )}
          <SkipForward
            onClick={next}
            className="w-5 h-5 cursor-pointer text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
          />
          <Repeat className="w-4 h-4 cursor-pointer text-[var(--text-meta)] hover:text-[var(--accent)] transition-colors" />
        </div>
        <div className="flex items-center gap-4 w-full">
          <p className="text-[10px] text-[var(--text-meta)] font-mono min-w-[35px] text-right">
            {time.currentTime.minute}:{String(time.currentTime.second).padStart(2, '0')}
          </p>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="flex-1 bg-[var(--bg-hover)] rounded-full cursor-pointer h-1 relative overflow-hidden group"
          >
            <div
              ref={seekBar}
              className="h-full bg-[var(--accent)] rounded-full w-0 transition-all duration-75 relative z-10"
            />
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <p className="text-[10px] text-[var(--text-meta)] font-mono min-w-[35px]">
             {track.duration}
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-end gap-5 w-1/4 text-[var(--text-meta)]">
        <ListMusic className="w-4 h-4 cursor-pointer hover:text-[var(--accent)] transition-colors" />
        <Mic className="w-4 h-4 cursor-pointer hover:text-[var(--accent)] transition-colors" />
        <Volume2 className="w-4 h-4 cursor-pointer hover:text-[var(--accent)] transition-colors" />
        <Maximize2 className="w-4 h-4 cursor-pointer hover:text-[var(--accent)] transition-colors" />
      </div>
    </div>
  ) : null;
};

export default Player;
