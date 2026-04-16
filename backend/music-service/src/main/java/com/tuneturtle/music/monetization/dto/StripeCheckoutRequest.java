package com.tuneturtle.music.monetization.dto;

public class StripeCheckoutRequest {
    private TransactionRequest transactionDetails;
    private String successUrl;
    private String cancelUrl;

    public StripeCheckoutRequest() {}

    public TransactionRequest getTransactionDetails() {
        return transactionDetails;
    }

    public void setTransactionDetails(TransactionRequest transactionDetails) {
        this.transactionDetails = transactionDetails;
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
