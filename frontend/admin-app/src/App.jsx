
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AddSong from "./pages/AddSong";
import ListSong from "./pages/ListSong";
import AddAlbum from "./pages/AddAlbum";
import ListAlbum from "./pages/ListAlbum";
import ListArtists from "./pages/ListArtists";
import DashboardLayout from "./layout/DashboardLayout";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#121214',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '16px'
                        }
                    }}
                />
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<Navigate to="/list-songs" replace />} />
                        <Route path="/list-songs" element={<ListSong />} />
                        <Route path="/add-song" element={<AddSong />} />
                        <Route path="/list-albums" element={<ListAlbum />} />
                        <Route path="/add-album" element={<AddAlbum />} />
                        <Route path="/list-artists" element={<ListArtists />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>
    );
};

export default App;
