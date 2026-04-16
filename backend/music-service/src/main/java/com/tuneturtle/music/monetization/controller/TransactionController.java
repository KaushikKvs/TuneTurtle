package com.tuneturtle.music.monetization.controller;

import com.tuneturtle.music.monetization.dto.PaymentVerificationRequest;
import com.tuneturtle.music.monetization.dto.StripeCartCheckoutRequest;
import com.tuneturtle.music.monetization.dto.StripeCheckoutRequest;
import com.tuneturtle.music.monetization.dto.StripeSessionConfirmationRequest;
import com.tuneturtle.music.monetization.dto.TransactionRequest;
import com.tuneturtle.music.monetization.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody TransactionRequest request) {
        try {
            String orderId = transactionService.createRazorpayOrder(request);
            return ResponseEntity.ok(Map.of("orderId", orderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            return ResponseEntity.ok(transactionService.verifyPayment(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stripe/create-checkout-session")
    public ResponseEntity<?> createStripeCheckoutSession(@RequestBody StripeCheckoutRequest request) {
        try {
            return ResponseEntity.ok(transactionService.createStripeCheckoutSession(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stripe/confirm-session")
    public ResponseEntity<?> confirmStripeSession(@RequestBody StripeSessionConfirmationRequest request) {
        try {
            return ResponseEntity.ok(transactionService.confirmStripeSession(request.getSessionId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stripe/create-cart-checkout-session")
    public ResponseEntity<?> createStripeCartCheckoutSession(@RequestBody StripeCartCheckoutRequest request) {
        try {
            return ResponseEntity.ok(transactionService.createStripeCartCheckoutSession(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stripe/confirm-cart-session")
    public ResponseEntity<?> confirmStripeCartSession(@RequestBody StripeSessionConfirmationRequest request) {
        try {
            return ResponseEntity.ok(transactionService.confirmStripeCartSession(request.getSessionId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/earnings")
    public ResponseEntity<?> getEarnings() {
        try {
            return ResponseEntity.ok(transactionService.getEarningsOverview());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-subscriptions")
    public ResponseEntity<?> getMySubscriptions() {
        try {
            return ResponseEntity.ok(transactionService.getMySubscriptions());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-purchased-songs")
    public ResponseEntity<?> getMyPurchasedSongs() {
        try {
            return ResponseEntity.ok(transactionService.getMyPurchasedSongIds());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/ownership")
    public ResponseEntity<?> getOwnership() {
        try {
            return ResponseEntity.ok(transactionService.resolveOwnership());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
