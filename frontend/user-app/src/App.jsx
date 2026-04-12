import Register from "./components/register";
import Login from "./components/login";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "./components/AuthWrapper";
import Display from "./components/Display";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import { useContext } from "react";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track } = useContext(PlayerContext);
  return (
    <>
      <Toaster />
      <AuthWrapper>
        <div className="h-screen bg-black">
          <div className="h-[90%] flex">
            <Sidebar />
            <Display />
          </div>
          <Player />
          <audio ref={audioRef} src={track ? track.file : " "} preload="auto" />
        </div>
      </AuthWrapper>
    </>
  );
};

export default App;
