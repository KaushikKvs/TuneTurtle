package com.tuneturtle.music.monetization.dto;

public class StripeSessionConfirmationRequest {
    private String sessionId;

    public StripeSessionConfirmationRequest() {}

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
