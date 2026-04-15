import React, { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import {
  ListMusic,
  Maximize2,
  Mic,
  Minimize2,
  Volume2,
  VolumeX,
  Volume1,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
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
    volume,
    changeVolume,
    isMuted,
    toggleMute,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = useContext(PlayerContext);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Pick the right volume icon based on level
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // Pick the right repeat icon and color
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;
  const repeatActive = repeatMode !== 'off';

  return track ? (
    <div className={`premium-tracer h-24 rounded-[2rem] bg-transparent backdrop-blur-xl flex justify-between items-center text-[var(--text-primary)] px-6 shadow-none z-50 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] border border-transparent`}>
      {/* Track Info - left */}
      <div className="hidden lg:flex items-center gap-5 w-1/4">
        <img src={track.image} alt="" className="w-14 h-14 rounded-xl shadow-lg object-cover" />
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{track.name}</p>
          <p className="text-[11px] text-[var(--text-secondary)] truncate">{track.desc}</p>
        </div>
      </div>

      {/* Playback Controls - center */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[600px]">
        <div className="flex gap-8 items-center">
          {/* Shuffle */}
          <button onClick={toggleShuffle} title={isShuffled ? "Shuffle: On" : "Shuffle: Off"}>
            <Shuffle
              className={`w-4 h-4 cursor-pointer transition-colors ${
                isShuffled
                  ? "text-[var(--accent)] drop-shadow-[0_0_4px_var(--accent-glow)]"
                  : "text-[var(--text-meta)] hover:text-[var(--accent)]"
              }`}
            />
          </button>

          {/* Previous */}
          <SkipBack
            onClick={previous}
            className="w-5 h-5 cursor-pointer text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors active:scale-90"
          />

          {/* Play/Pause */}
          {playStatus ? (
            <div onClick={pause} className="w-10 h-10 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-base)] rounded-full hover:scale-110 transition-all cursor-pointer shadow-lg hover:shadow-[var(--accent-glow)]">
                <Pause className="w-5 h-5 fill-current" />
            </div>
          ) : (
            <div onClick={play} className="w-10 h-10 flex items-center justify-center bg-[var(--accent)] text-white rounded-full hover:scale-110 transition-all cursor-pointer shadow-lg shadow-[var(--accent-glow)]">
                <Play className="w-5 h-5 fill-current ml-1" />
            </div>
          )}

          {/* Next */}
          <SkipForward
            onClick={next}
            className="w-5 h-5 cursor-pointer text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors active:scale-90"
          />

          {/* Repeat */}
          <button onClick={toggleRepeat} title={`Repeat: ${repeatMode}`}>
            <RepeatIcon
              className={`w-4 h-4 cursor-pointer transition-colors ${
                repeatActive
                  ? "text-[var(--accent)] drop-shadow-[0_0_4px_var(--accent-glow)]"
                  : "text-[var(--text-meta)] hover:text-[var(--accent)]"
              }`}
            />
          </button>
        </div>

        {/* Seek Bar */}
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

      {/* Right Controls - volume, queue, fullscreen */}
      <div className="hidden lg:flex items-center justify-end gap-5 w-1/4 text-[var(--text-meta)]">
        {/* Queue */}
        <button onClick={() => {
            import('react-hot-toast').then(({ default: toast }) => toast("Queue feature coming soon...", { icon: '🎵', style: { background: 'var(--bg-surface)', color: 'var(--text-primary)' } }));
        }} title="Queue" className="flex items-center justify-center">
            <ListMusic className="w-4 h-4 cursor-pointer hover:text-[var(--accent)] transition-colors" />
        </button>

        {/* Lyrics */}
        <button onClick={() => {
            import('react-hot-toast').then(({ default: toast }) => toast("Lyrics feature coming soon...", { icon: '🎤', style: { background: 'var(--bg-surface)', color: 'var(--text-primary)' } }));
        }} title="Lyrics" className="flex items-center justify-center">
            <Mic className="w-4 h-4 cursor-pointer hover:text-[var(--accent)] transition-colors" />
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 group w-28">
          <button onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"} className="flex items-center justify-center">
            <VolumeIcon className={`w-4 h-4 cursor-pointer transition-colors ${isMuted ? 'text-red-400' : 'hover:text-[var(--accent)]'}`} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer outline-none relative opacity-70 group-hover:opacity-100 transition-opacity m-0
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--accent)] [&::-moz-range-thumb]:border-0
              [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-1"
          />
        </div>

        {/* Fullscreen */}
        <button onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} className="flex items-center justify-center">
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 cursor-pointer hover:text-[var(--accent)] transition-colors" />
          ) : (
            <Maximize2 className="w-4 h-4 cursor-pointer hover:text-[var(--accent)] transition-colors" />
          )}
        </button>
      </div>
    </div>
  ) : null;
};

export default Player;
