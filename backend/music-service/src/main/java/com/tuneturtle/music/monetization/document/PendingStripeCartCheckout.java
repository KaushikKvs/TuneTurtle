package com.tuneturtle.music.monetization.document;

import com.tuneturtle.music.monetization.dto.CartCheckoutItem;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "pending_stripe_cart_checkouts")
public class PendingStripeCartCheckout {
    @Id
    private String id;
    private String sessionId;
    private String fanId;
    private List<CartCheckoutItem> items;
    private boolean confirmed;
    private LocalDateTime createdAt = LocalDateTime.now();

    public PendingStripeCartCheckout() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getFanId() {
        return fanId;
    }

    public void setFanId(String fanId) {
        this.fanId = fanId;
    }

    public List<CartCheckoutItem> getItems() {
        return items;
    }

    public void setItems(List<CartCheckoutItem> items) {
        this.items = items;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
