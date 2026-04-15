package com.tuneturtle.music.monetization.controller;

import com.tuneturtle.music.monetization.dto.PaymentVerificationRequest;
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
}
