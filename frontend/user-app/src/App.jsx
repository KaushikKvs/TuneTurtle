import Register from "./components/register";
import Login from "./components/login";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "./components/AuthWrapper";
import Display from "./components/Display";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import { useContext, useState } from "react";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track } = useContext(PlayerContext);
  const [playerVisible, setPlayerVisible] = useState(true);
  return (
    <>
      <Toaster />
      <AuthWrapper>
        <div className="h-screen bg-black flex flex-col font-sans overflow-hidden relative group/player-zone">
          <div className="flex-[1] flex min-h-0 overflow-hidden pb-4">
            <Sidebar />
            <Display playerVisible={playerVisible} setPlayerVisible={setPlayerVisible} />
          </div>
          
          {/* Invisible hit-zone strictly at the very bottom edge to trigger player pop-up */}
          <div className={`absolute bottom-2 inset-x-0 z-50 pointer-events-none px-2 focus-within:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${playerVisible ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'}`}>
            <div className="pointer-events-auto">
              <Player />
            </div>
          </div>
          <audio ref={audioRef} src={track ? track.file : " "} preload="auto" />
        </div>
      </AuthWrapper>
    </>
  );
};

export default App;
