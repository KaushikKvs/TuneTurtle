package com.tuneturtle.music.catalog.dto;


import org.springframework.web.multipart.MultipartFile;

public class AlbumRequest {

    private String id;
    private String name;
    private String desc;
    private String bgColor;
    private MultipartFile imageFile;
    private Double price;
    private Boolean isFree;

    public AlbumRequest() {}
    public AlbumRequest(String id, String name, String desc, String bgColor, MultipartFile imageFile, Double price, Boolean isFree) {
        this.id = id; this.name = name; this.desc = desc; this.bgColor = bgColor; this.imageFile = imageFile; this.price = price; this.isFree = isFree;
    }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }
    public String getBgColor() { return bgColor; }
    public void setBgColor(String bgColor) { this.bgColor = bgColor; }
    public MultipartFile getImageFile() { return imageFile; }
    public void setImageFile(MultipartFile imageFile) { this.imageFile = imageFile; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }
}
