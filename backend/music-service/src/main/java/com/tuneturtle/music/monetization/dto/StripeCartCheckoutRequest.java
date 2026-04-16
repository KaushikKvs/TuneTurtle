package com.tuneturtle.music.monetization.dto;

import java.util.List;

public class StripeCartCheckoutRequest {
    private List<CartCheckoutItem> items;
    private String successUrl;
    private String cancelUrl;

    public StripeCartCheckoutRequest() {}

    public List<CartCheckoutItem> getItems() {
        return items;
    }

    public void setItems(List<CartCheckoutItem> items) {
        this.items = items;
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }
}
