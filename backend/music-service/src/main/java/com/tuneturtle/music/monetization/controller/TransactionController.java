package com.tuneturtle.music.monetization.controller;

import com.tuneturtle.music.monetization.dto.TransactionRequest;
import com.tuneturtle.music.monetization.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody TransactionRequest request) {
        try {
            return ResponseEntity.ok(transactionService.processCheckout(request));
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
