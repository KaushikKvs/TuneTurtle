import { createContext, useContext, useEffect, useState } from "react";
import { PlayerContext } from "./PlayerContext";

export const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ songs: [], albums: [] });

  const [isSearchActive, setIsSearchActive] = useState(false);

  const { songsData, albumsData } = useContext(PlayerContext);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults({ songs: [], albums: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredSongs = songsData.filter(
      (song) =>
        song.name.toLowerCase().includes(query) ||
        song.desc.toLowerCase().includes(query)
    );

    const filteredAlbums = albumsData.filter(
      (album) =>
        album.name.toLowerCase().includes(query) ||
        album.desc.toLowerCase().includes(query)
    );

    setSearchResults({
      songs: filteredSongs,
      albums: filteredAlbums,
    });
  }, [searchQuery, songsData, albumsData]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({ songs: [], albums: [] });
    setIsSearchActive(false);
  };

  const contextValue = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchActive,
    setIsSearchActive,
    clearSearch,
  };
  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
