package com.tuneturtle.music.monetization.dto;

public class TransactionRequest {
    private String artistId;
    private String type; // ALBUM, SUBSCRIPTION
    private String itemId;
    private Double amountPaid;

    public TransactionRequest() {}

    public String getArtistId() { return artistId; }
    public void setArtistId(String artistId) { this.artistId = artistId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }
}
