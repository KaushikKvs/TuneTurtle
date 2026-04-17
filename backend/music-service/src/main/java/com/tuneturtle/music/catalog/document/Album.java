package com.tuneturtle.music.catalog.document;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "albums")
public class Album {
    @Id
    @JsonProperty("_id")
    private String id;
    private String name;
    private String desc;
    private String bgColor;
    private String imageUrl;
    private String artistId;
    private Double price;
    private Boolean isFree;
    private Set<String> likedBy = new HashSet<>();
    private long views = 0;

    public Album() {}
    public Album(String id, String name, String desc, String bgColor, String imageUrl, String artistId, Double price, Boolean isFree, Set<String> likedBy) {
        this.id = id; this.name = name; this.desc = desc; this.bgColor = bgColor; this.imageUrl = imageUrl; this.artistId = artistId; this.price = price; this.isFree = isFree;
        this.likedBy = likedBy != null ? likedBy : new HashSet<>();
    }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }
    public String getBgColor() { return bgColor; }
    public void setBgColor(String bgColor) { this.bgColor = bgColor; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getArtistId() { return artistId; }
    public void setArtistId(String artistId) { this.artistId = artistId; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }
    public Set<String> getLikedBy() { return likedBy; }
    public void setLikedBy(Set<String> likedBy) { this.likedBy = likedBy; }
    public Integer getLikesCount() { return likedBy != null ? likedBy.size() : 0; }

    public static AlbumBuilder builder() { return new AlbumBuilder(); }

    public static class AlbumBuilder {
        private String id; private String name; private String desc; private String bgColor; private String imageUrl; private String artistId; private Double price; private Boolean isFree; private Set<String> likedBy;
        public AlbumBuilder id(String id) { this.id = id; return this; }
        public AlbumBuilder name(String name) { this.name = name; return this; }
        public AlbumBuilder desc(String desc) { this.desc = desc; return this; }
        public AlbumBuilder bgColor(String bgColor) { this.bgColor = bgColor; return this; }
        public AlbumBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public AlbumBuilder artistId(String artistId) { this.artistId = artistId; return this; }
        public AlbumBuilder price(Double price) { this.price = price; return this; }
        public AlbumBuilder isFree(Boolean isFree) { this.isFree = isFree; return this; }
        public AlbumBuilder likedBy(Set<String> likedBy) { this.likedBy = likedBy; return this; }
        public Album build() { return new Album(id, name, desc, bgColor, imageUrl, artistId, price, isFree, likedBy); }
    }
}
