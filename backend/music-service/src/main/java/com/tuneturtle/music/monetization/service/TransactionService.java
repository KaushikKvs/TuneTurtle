package com.tuneturtle.music.monetization.service;

import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.repository.UserRepository;
import com.tuneturtle.music.monetization.document.Transaction;
import com.tuneturtle.music.monetization.dto.EarningsResponse;
import com.tuneturtle.music.monetization.dto.TransactionRequest;
import com.tuneturtle.music.monetization.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
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
    private final UserRepository userRepository;
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

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

        return processCheckout(request.getTransactionDetails());
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
    private Transaction processCheckout(TransactionRequest request) {
        String fanEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User fan = userRepository.findByEmail(fanEmail).orElseThrow(() -> new RuntimeException("Fan not found"));

        double platformFee = request.getAmountPaid() * PLATFORM_FEE_PERCENTAGE;
        double artistEarnings = request.getAmountPaid() - platformFee;

        Transaction transaction = Transaction.builder()
                .fanId(fan.getId())
                .artistId(request.getArtistId())
                .type(request.getType())
                .itemId(request.getItemId())
                .amountPaid(request.getAmountPaid())
                .platformFee(platformFee)
                .artistEarnings(artistEarnings)
                .createdAt(LocalDateTime.now())
                .build();

        return transactionRepository.save(transaction);
    }

    public EarningsResponse getEarningsOverview() {
        String artistEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User artist = userRepository.findByEmail(artistEmail).orElseThrow(() -> new RuntimeException("Artist not found"));

        List<Transaction> transactions = transactionRepository.findByArtistId(artist.getId());

        double total = 0;
        double thisMonth = 0;
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        for (Transaction t : transactions) {
            total += t.getArtistEarnings();
            if (t.getCreatedAt().isAfter(thirtyDaysAgo)) {
                thisMonth += t.getArtistEarnings();
            }
        }

        return EarningsResponse.builder()
                .totalEarnings(total)
                .thisMonthEarnings(thisMonth)
                .totalSales(transactions.size())
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
}
