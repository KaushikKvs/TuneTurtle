package com.tuneturtle.music.catalog.dto;


import org.springframework.web.multipart.MultipartFile;

public class SongRequest {

    private String id;
    private String name;
    private String desc;
    private String album;
    private MultipartFile audioFile;
    private MultipartFile imageFile;
    private Double price;
    private Boolean isFree;

    public SongRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }

    public MultipartFile getAudioFile() { return audioFile; }
    public void setAudioFile(MultipartFile audioFile) { this.audioFile = audioFile; }

    public MultipartFile getImageFile() { return imageFile; }
    public void setImageFile(MultipartFile imageFile) { this.imageFile = imageFile; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }
}
