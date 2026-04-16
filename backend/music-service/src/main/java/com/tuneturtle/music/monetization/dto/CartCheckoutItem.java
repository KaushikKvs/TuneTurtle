package com.tuneturtle.music.monetization.dto;

public class CartCheckoutItem {
    private String songId; // itemId
    private String songName; // itemName
    private String artistId;
    private Double amountPaid;
    private String type; // "SONG" or "ALBUM"

    public CartCheckoutItem() {}

    public String getSongId() {
        return songId;
    }

    public void setSongId(String songId) {
        this.songId = songId;
    }

    public String getSongName() {
        return songName;
    }

    public void setSongName(String songName) {
        this.songName = songName;
    }

    public String getArtistId() {
        return artistId;
    }

    public void setArtistId(String artistId) {
        this.artistId = artistId;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
