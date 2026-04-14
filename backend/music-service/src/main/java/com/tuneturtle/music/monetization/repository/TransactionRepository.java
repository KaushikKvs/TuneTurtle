package com.tuneturtle.music.monetization.repository;

import com.tuneturtle.music.monetization.document.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByArtistId(String artistId);
    List<Transaction> findByFanId(String fanId);
}
