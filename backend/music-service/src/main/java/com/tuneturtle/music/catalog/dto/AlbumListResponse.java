package com.tuneturtle.music.catalog.dto;

import com.tuneturtle.music.catalog.document.Album;

import java.util.List;

public class AlbumListResponse {

    private boolean success;
    private List<Album> albums;

    public AlbumListResponse() {}
    public AlbumListResponse(Boolean success, List<Album> albums) { this.success = success; this.albums = albums; }
    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }
    public List<Album> getAlbums() { return albums; }
    public void setAlbums(List<Album> albums) { this.albums = albums; }
}
