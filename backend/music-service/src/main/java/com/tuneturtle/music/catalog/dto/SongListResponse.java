package com.tuneturtle.music.catalog.dto;


import com.tuneturtle.music.catalog.document.Song;
import java.util.List;

public class SongListResponse {

    private Boolean success;
    private List<Song> songs;

    public SongListResponse() {}

    public SongListResponse(Boolean success, List<Song> songs) {
        this.success = success;
        this.songs = songs;
    }

    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }

    public List<Song> getSongs() { return songs; }
    public void setSongs(List<Song> songs) { this.songs = songs; }
}
