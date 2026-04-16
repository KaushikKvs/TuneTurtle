package com.tuneturtle.music.monetization.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    private String fanId;
    private String artistId;
    private String type; // "ALBUM", "SONG", "SUBSCRIPTION"
    private String itemId; // albumId, songId, or null if subscription
    @org.springframework.data.mongodb.core.index.Indexed(unique = true)
    private String paymentReference; // gateway payment/session id for idempotency

    private Double amountPaid;
    private Double platformFee;
    private Double artistEarnings;
    private LocalDateTime expiryDate;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Transaction() {}

    public Transaction(String id, String fanId, String artistId, String type, String itemId, String paymentReference, Double amountPaid, Double platformFee, Double artistEarnings, LocalDateTime expiryDate, LocalDateTime createdAt) {
        this.id = id;
        this.fanId = fanId;
        this.artistId = artistId;
        this.type = type;
        this.itemId = itemId;
        this.paymentReference = paymentReference;
        this.amountPaid = amountPaid;
        this.platformFee = platformFee;
        this.artistEarnings = artistEarnings;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFanId() { return fanId; }
    public void setFanId(String fanId) { this.fanId = fanId; }

    public String getArtistId() { return artistId; }
    public void setArtistId(String artistId) { this.artistId = artistId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public Double getPlatformFee() { return platformFee; }
    public void setPlatformFee(Double platformFee) { this.platformFee = platformFee; }

    public Double getArtistEarnings() { return artistEarnings; }
    public void setArtistEarnings(Double artistEarnings) { this.artistEarnings = artistEarnings; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static TransactionBuilder builder() {
        return new TransactionBuilder();
    }

    public static class TransactionBuilder {
        private String id;
        private String fanId;
        private String artistId;
        private String type;
        private String itemId;
        private String paymentReference;
        private Double amountPaid;
        private Double platformFee;
        private Double artistEarnings;
        private LocalDateTime expiryDate;
        private LocalDateTime createdAt;

        public TransactionBuilder id(String id) { this.id = id; return this; }
        public TransactionBuilder fanId(String fanId) { this.fanId = fanId; return this; }
        public TransactionBuilder artistId(String artistId) { this.artistId = artistId; return this; }
        public TransactionBuilder type(String type) { this.type = type; return this; }
        public TransactionBuilder itemId(String itemId) { this.itemId = itemId; return this; }
        public TransactionBuilder paymentReference(String paymentReference) { this.paymentReference = paymentReference; return this; }
        public TransactionBuilder amountPaid(Double amountPaid) { this.amountPaid = amountPaid; return this; }
        public TransactionBuilder platformFee(Double platformFee) { this.platformFee = platformFee; return this; }
        public TransactionBuilder artistEarnings(Double artistEarnings) { this.artistEarnings = artistEarnings; return this; }
        public TransactionBuilder expiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; return this; }
        public TransactionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Transaction build() {
            return new Transaction(id, fanId, artistId, type, itemId, paymentReference, amountPaid, platformFee, artistEarnings, expiryDate, createdAt);
        }
    }
}
