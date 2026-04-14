package com.tuneturtle.music.catalog.document;


import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "songs")
public class Song {

    @Id
    @JsonProperty("_id")
    private String id;
    private String name;
    private String desc;
    private String album;
    private String image;
    private String file;
    private String duration;
    private String artistId;
    private Double price;
    private Boolean isFree;
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public Song() {}
    public Song(String id, String name, String desc, String album, String image, String file, String duration, String artistId, Double price, Boolean isFree) {
        this.id = id; this.name = name; this.desc = desc; this.album = album; this.image = image; this.file = file; this.duration = duration; this.artistId = artistId; this.price = price; this.isFree = isFree;
    }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }
    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getFile() { return file; }
    public void setFile(String file) { this.file = file; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getArtistId() { return artistId; }
    public void setArtistId(String artistId) { this.artistId = artistId; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static SongBuilder builder() { return new SongBuilder(); }
    public static class SongBuilder {
        private String id; private String name; private String desc; private String album; private String image; private String file; private String duration; private String artistId; private Double price; private Boolean isFree; private java.time.LocalDateTime createdAt;
        public SongBuilder id(String id) { this.id = id; return this; }
        public SongBuilder name(String name) { this.name = name; return this; }
        public SongBuilder desc(String desc) { this.desc = desc; return this; }
        public SongBuilder album(String album) { this.album = album; return this; }
        public SongBuilder image(String image) { this.image = image; return this; }
        public SongBuilder file(String file) { this.file = file; return this; }
        public SongBuilder duration(String duration) { this.duration = duration; return this; }
        public SongBuilder artistId(String artistId) { this.artistId = artistId; return this; }
        public SongBuilder price(Double price) { this.price = price; return this; }
        public SongBuilder isFree(Boolean isFree) { this.isFree = isFree; return this; }
        public SongBuilder createdAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Song build() { return new Song(id, name, desc, album, image, file, duration, artistId, price, isFree); }
    }
}
