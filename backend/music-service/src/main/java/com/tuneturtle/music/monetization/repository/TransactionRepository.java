package com.tuneturtle.music.monetization.repository;

import com.tuneturtle.music.monetization.document.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByArtistId(String artistId);
    List<Transaction> findByFanId(String fanId);
    List<Transaction> findByFanIdAndExpiryDateAfter(String fanId, LocalDateTime now);
    Optional<Transaction> findByPaymentReference(String paymentReference);
}
