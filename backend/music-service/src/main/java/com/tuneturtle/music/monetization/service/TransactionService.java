package com.tuneturtle.music.monetization.service;

import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.repository.UserRepository;
import com.tuneturtle.music.monetization.document.PendingStripeCartCheckout;
import com.tuneturtle.music.monetization.document.Transaction;
import com.tuneturtle.music.monetization.dto.CartCheckoutItem;
import com.tuneturtle.music.monetization.dto.EarningsResponse;
import com.tuneturtle.music.monetization.dto.StripeCheckoutRequest;
import com.tuneturtle.music.monetization.dto.StripeCartCheckoutRequest;
import com.tuneturtle.music.monetization.dto.TransactionRequest;
import com.tuneturtle.music.monetization.repository.PendingStripeCartCheckoutRepository;
import com.tuneturtle.music.monetization.repository.TransactionRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import com.tuneturtle.music.monetization.dto.PaymentVerificationRequest;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final com.tuneturtle.music.monetization.repository.TransactionJpaRepository transactionJpaRepository;
    private final UserRepository userRepository;
    private final PendingStripeCartCheckoutRepository pendingStripeCartCheckoutRepository;
    private final com.tuneturtle.music.catalog.repository.AlbumRepository albumRepository;
    private final com.tuneturtle.music.catalog.repository.SongRepository songRepository;
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private static final double PLATFORM_FEE_PERCENTAGE = 0.15; // 15%

    // 1. Create Order inside Razorpay
    public String createRazorpayOrder(TransactionRequest request) throws Exception {
        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpaySecret);

        JSONObject orderRequest = new JSONObject();
        // Razorpay accepts amount in paise (1 INR = 100 paise)
        orderRequest.put("amount", (int) (request.getAmountPaid() * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = client.orders.create(orderRequest);
        return order.get("id");
    }

    // 2. Verify Signature and Save Transaction
    public Transaction verifyPayment(PaymentVerificationRequest request) throws Exception {
        String generatedSignature = calculateRFC2104HMAC(
                request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                razorpaySecret
        );

        if (!generatedSignature.equals(request.getRazorpaySignature())) {
            throw new RuntimeException("Payment verification failed: Invalid signature");
        }

        return processCheckout(request.getTransactionDetails(), request.getRazorpayPaymentId());
    }

    private String calculateRFC2104HMAC(String data, String secret) throws Exception {
        SecretKeySpec signingKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder result = new StringBuilder();
        for (byte b : rawHmac) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    // Process actual DB save after verification (was previously step 1)
    public Map<String, String> createStripeCheckoutSession(StripeCheckoutRequest request) throws StripeException {
        if (request.getTransactionDetails() == null) {
            throw new RuntimeException("Transaction details are required");
        }
        if (request.getSuccessUrl() == null || request.getSuccessUrl().isBlank()) {
            throw new RuntimeException("Success URL is required");
        }
        if (request.getCancelUrl() == null || request.getCancelUrl().isBlank()) {
            throw new RuntimeException("Cancel URL is required");
        }

        String fanEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User fan = userRepository.findByEmail(fanEmail).orElseThrow(() -> new RuntimeException("Fan not found"));

        TransactionRequest transactionDetails = request.getTransactionDetails();
        long amountInSmallestUnit = Math.round(transactionDetails.getAmountPaid() * 100);
        if (amountInSmallestUnit <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        Stripe.apiKey = stripeSecretKey;

        Map<String, String> metadata = new HashMap<>();
        metadata.put("fanId", fan.getId());
        metadata.put("artistId", transactionDetails.getArtistId());
        metadata.put("type", transactionDetails.getType());
        metadata.put("itemId", transactionDetails.getItemId() == null ? "" : transactionDetails.getItemId());
        metadata.put("amountPaid", String.valueOf(transactionDetails.getAmountPaid()));

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(request.getSuccessUrl())
                .setCancelUrl(request.getCancelUrl())
                .setCustomerEmail(fanEmail)
                .putAllMetadata(metadata)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("inr")
                                                .setUnitAmount(amountInSmallestUnit)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("TuneTurtle " + transactionDetails.getType())
                                                                .setDescription("Purchase on TuneTurtle marketplace")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);
        return Map.of("sessionId", session.getId(), "url", session.getUrl());
    }

    public Transaction confirmStripeSession(String sessionId) throws StripeException {
        if (sessionId == null || sessionId.isBlank()) {
            throw new RuntimeException("Session ID is required");
        }

        // Try Mongo first for historical reasons / speed
        Transaction existingTransaction = transactionRepository.findByPaymentReference(sessionId).orElse(null);
        if (existingTransaction != null) {
            return existingTransaction;
        }

        Stripe.apiKey = stripeSecretKey;
        Session session = Session.retrieve(sessionId);

        if (!"paid".equalsIgnoreCase(session.getPaymentStatus())) {
            throw new RuntimeException("Stripe payment is not completed");
        }

        Map<String, String> metadata = session.getMetadata();
        TransactionRequest transactionRequest = new TransactionRequest();
        transactionRequest.setArtistId(metadata.get("artistId"));
        transactionRequest.setType(metadata.get("type"));
        transactionRequest.setItemId(metadata.get("itemId"));
        transactionRequest.setAmountPaid(Double.parseDouble(metadata.get("amountPaid")));

        return processCheckout(transactionRequest, sessionId);
    }

    private LocalDateTime calculateExpiryDate(User fan) {
        // Safety default for users without a plan set
        User.Plan plan = (fan != null && fan.getPlan() != null) ? fan.getPlan() : User.Plan.BASIC;
        
        switch (plan) {
            case PREMIUM:
                return LocalDateTime.now().plusDays(90);
            case STANDARD:
                return LocalDateTime.now().plusDays(30);
            case BASIC:
            default:
                return LocalDateTime.now().plusDays(7);
        }
    }

    public Map<String, String> createStripeCartCheckoutSession(StripeCartCheckoutRequest request) throws StripeException {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        if (request.getSuccessUrl() == null || request.getSuccessUrl().isBlank()) {
            throw new RuntimeException("Success URL is required");
        }
        if (request.getCancelUrl() == null || request.getCancelUrl().isBlank()) {
            throw new RuntimeException("Cancel URL is required");
        }

        String fanEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User fan = userRepository.findByEmail(fanEmail).orElseThrow(() -> new RuntimeException("Fan not found"));

        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(request.getSuccessUrl())
                .setCancelUrl(request.getCancelUrl())
                .setCustomerEmail(fanEmail)
                .putMetadata("checkoutType", "SONG_CART")
                .putMetadata("fanId", fan.getId());

        for (CartCheckoutItem item : request.getItems()) {
            if (item.getSongId() == null || item.getSongId().isBlank()) {
                throw new RuntimeException("Cart item song ID is missing");
            }
            if (item.getArtistId() == null || item.getArtistId().isBlank()) {
                throw new RuntimeException("Cart item artist ID is missing");
            }
            if (item.getAmountPaid() == null || item.getAmountPaid() <= 0) {
                throw new RuntimeException("Cart item amount must be greater than 0");
            }

            long amountInSmallestUnit = Math.round(item.getAmountPaid() * 100);
            paramsBuilder.addLineItem(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("inr")
                                            .setUnitAmount(amountInSmallestUnit)
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName(item.getSongName() == null || item.getSongName().isBlank() ? "TuneTurtle Song" : item.getSongName())
                                                            .setDescription("TuneTurtle song license purchase")
                                                            .build()
                                            )
                                            .build()
                            )
                            .build()
            );
        }

        Session session = Session.create(paramsBuilder.build());

        PendingStripeCartCheckout pendingCheckout = new PendingStripeCartCheckout();
        pendingCheckout.setSessionId(session.getId());
        pendingCheckout.setFanId(fan.getId());
        pendingCheckout.setItems(request.getItems());
        pendingCheckout.setConfirmed(false);
        pendingCheckout.setCreatedAt(LocalDateTime.now());
        pendingStripeCartCheckoutRepository.save(pendingCheckout);

        return Map.of("sessionId", session.getId(), "url", session.getUrl());
    }

    public List<Transaction> confirmStripeCartSession(String sessionId) throws StripeException {
        if (sessionId == null || sessionId.isBlank()) {
            throw new RuntimeException("Session ID is required");
        }

        PendingStripeCartCheckout pendingCheckout = pendingStripeCartCheckoutRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart checkout session not found"));

        if (pendingCheckout.isConfirmed()) {
            return pendingCheckout.getItems().stream()
                    .map(item -> transactionRepository.findByPaymentReference(sessionId + ":" + item.getSongId()).orElse(null))
                    .filter(t -> t != null)
                    .collect(Collectors.toList());
        }

        Stripe.apiKey = stripeSecretKey;
        Session session = Session.retrieve(sessionId);
        if (!"paid".equalsIgnoreCase(session.getPaymentStatus())) {
            throw new RuntimeException("Stripe payment is not completed");
        }

        List<Transaction> savedTransactions = new ArrayList<>();
        for (CartCheckoutItem item : pendingCheckout.getItems()) {
            String paymentReference = sessionId + ":" + item.getSongId();
            Transaction existingTransaction = transactionRepository.findByPaymentReference(paymentReference).orElse(null);
            if (existingTransaction != null) {
                savedTransactions.add(existingTransaction);
                continue;
            }

            TransactionRequest transactionRequest = new TransactionRequest();
            transactionRequest.setArtistId(item.getArtistId());
            transactionRequest.setType(item.getType() != null ? item.getType() : "SONG");
            transactionRequest.setItemId(item.getSongId());
            transactionRequest.setAmountPaid(item.getAmountPaid());
            
            try {
                savedTransactions.add(processCheckout(transactionRequest, paymentReference));
            } catch (Exception e) {
                // If it's a duplicate, find the existing one and add to list
                transactionRepository.findByPaymentReference(paymentReference).ifPresent(savedTransactions::add);
            }
        }

        pendingCheckout.setConfirmed(true);
        pendingStripeCartCheckoutRepository.save(pendingCheckout);
        return savedTransactions;
    }

    private Transaction processCheckout(TransactionRequest request, String paymentReference) {
        String fanEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User fan = userRepository.findByEmail(fanEmail).orElseThrow(() -> new RuntimeException("Fan not found"));

        double platformFee = request.getAmountPaid() * PLATFORM_FEE_PERCENTAGE;
        double artistEarnings = request.getAmountPaid() - platformFee;

        Transaction transaction = Transaction.builder()
                .fanId(fan.getId())
                .artistId(request.getArtistId())
                .type(request.getType())
                .itemId(request.getItemId())
                .paymentReference(paymentReference)
                .amountPaid(request.getAmountPaid())
                .platformFee(platformFee)
                .artistEarnings(artistEarnings)
                .expiryDate(calculateExpiryDate(fan))
                .createdAt(LocalDateTime.now())
                .build();

        Transaction savedMongoTx;
        try {
            savedMongoTx = transactionRepository.save(transaction);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            // Fetch existing if race condition happened
            return transactionRepository.findByPaymentReference(paymentReference).orElseThrow(() -> e);
        }

        // SYNC TO SUPABASE (PostgreSQL)
        try {
            com.tuneturtle.music.monetization.entity.TransactionEntity jpaEntity = com.tuneturtle.music.monetization.entity.TransactionEntity.builder()
                .mongoId(savedMongoTx.getId())
                .fanId(savedMongoTx.getFanId())
                .artistId(savedMongoTx.getArtistId())
                .type(savedMongoTx.getType())
                .itemId(savedMongoTx.getItemId())
                .paymentReference(savedMongoTx.getPaymentReference())
                .amountPaid(savedMongoTx.getAmountPaid())
                .platformFee(savedMongoTx.getPlatformFee())
                .artistEarnings(savedMongoTx.getArtistEarnings())
                .expiryDate(savedMongoTx.getExpiryDate())
                .createdAt(savedMongoTx.getCreatedAt())
                .build();
            transactionJpaRepository.save(jpaEntity);
        } catch (org.springframework.dao.DataIntegrityViolationException dive) {
            // Already synced, this is fine
            System.out.println("Supabase already synced for: " + paymentReference);
        } catch (Exception e) {
            // Log other errors but don't fail the checkout
            System.err.println("Supabase Sync Error: " + e.getMessage());
        }

        return savedMongoTx;
    }

    public EarningsResponse getEarningsOverview() {
        String artistEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User artist = userRepository.findByEmail(artistEmail).orElseThrow(() -> new RuntimeException("Artist not found"));

        // Use PostgreSQL as the source of truth for financial reporting
        Double total = transactionJpaRepository.sumTotalEarnings(artist.getId());
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Double thisMonth = transactionJpaRepository.sumEarningsSince(artist.getId(), thirtyDaysAgo);
        Long salesCount = transactionJpaRepository.countTotalSales(artist.getId());

        // Get recent transactions for the list view
        List<com.tuneturtle.music.monetization.entity.TransactionEntity> recentJpa = 
            transactionJpaRepository.findRecentByArtistId(artist.getId(), org.springframework.data.domain.PageRequest.of(0, 10));

        // Map JPA back to Mongo objects for the current DTO expectation (or update DTO later)
        List<Transaction> transactions = recentJpa.stream().map(jpa -> {
            Transaction t = new Transaction();
            t.setArtistEarnings(jpa.getArtistEarnings());
            t.setAmountPaid(jpa.getAmountPaid());
            t.setCreatedAt(jpa.getCreatedAt());
            t.setItemId(jpa.getItemId());
            t.setType(jpa.getType());
            return t;
        }).collect(Collectors.toList());

        return EarningsResponse.builder()
                .totalEarnings(total != null ? total : 0.0)
                .thisMonthEarnings(thisMonth != null ? thisMonth : 0.0)
                .totalSales(salesCount != null ? salesCount.intValue() : 0)
                .recentTransactions(transactions)
                .build();
    }

    public List<String> getMySubscriptions() {
        String fanEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User fan = userRepository.findByEmail(fanEmail).orElseThrow(() -> new RuntimeException("Fan not found"));

        return transactionRepository.findByFanId(fan.getId()).stream()
                .filter(t -> "SUBSCRIPTION".equals(t.getType()))
                .map(Transaction::getArtistId)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getMyPurchasedSongIds() {
        Map<String, Object> ownership = resolveOwnership();
        return (List<String>) ownership.get("songs");
    }

    public Map<String, Object> resolveOwnership() {
        String fanEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (fanEmail == null || "anonymousUser".equals(fanEmail)) {
            return Map.of("songs", List.of(), "albums", List.of(), "expiryMap", Map.of());
        }
        User fan = userRepository.findByEmail(fanEmail).orElseThrow(() -> new RuntimeException("Fan not found"));

        // Use the TransactionJpaRepository (Postgres) as the source of truth
        List<com.tuneturtle.music.monetization.entity.TransactionEntity> activeTransactions = 
            transactionJpaRepository.findByFanId(fan.getId());

        List<String> songIds = new ArrayList<>();
        List<String> albumIds = new ArrayList<>();
        Map<String, String> expiryMap = new HashMap<>();

        // 1. Direct Purchases
        for (com.tuneturtle.music.monetization.entity.TransactionEntity t : activeTransactions) {
            if (t.getExpiryDate() != null && t.getExpiryDate().isAfter(LocalDateTime.now())) {
                if ("SONG".equals(t.getType())) {
                    songIds.add(t.getItemId());
                } else if ("ALBUM".equals(t.getType())) {
                    albumIds.add(t.getItemId());
                }
                if (t.getItemId() != null) {
                    expiryMap.put(t.getItemId(), t.getExpiryDate().toString());
                }
            }
        }

        // 2. Resolve Subscriptions (future-proof)
        List<String> subscribedArtistIds = activeTransactions.stream()
                .filter(t -> "SUBSCRIPTION".equals(t.getType()) && (t.getExpiryDate() == null || t.getExpiryDate().isAfter(LocalDateTime.now())))
                .map(com.tuneturtle.music.monetization.entity.TransactionEntity::getArtistId)
                .distinct()
                .collect(Collectors.toList());

        for (String artistId : subscribedArtistIds) {
            songRepository.findByArtistId(artistId).forEach(s -> songIds.add(s.getId()));
            albumRepository.findByArtistId(artistId).forEach(a -> albumIds.add(a.getId()));
        }

        // 3. Resolve Album Bundles
        for (String albumId : new ArrayList<>(albumIds)) {
            albumRepository.findById(albumId).ifPresent(album -> {
                songRepository.findByAlbum(album.getName()).forEach(song -> songIds.add(song.getId()));
            });
        }

        Map<String, Object> response = new HashMap<>();
        response.put("songs", songIds.stream().distinct().collect(Collectors.toList()));
        response.put("albums", albumIds.stream().distinct().collect(Collectors.toList()));
        response.put("expiryMap", expiryMap);

        return response;
    }
}
