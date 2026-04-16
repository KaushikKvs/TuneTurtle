package com.tuneturtle.music.monetization.repository;

import com.tuneturtle.music.monetization.document.PendingStripeCartCheckout;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PendingStripeCartCheckoutRepository extends MongoRepository<PendingStripeCartCheckout, String> {
    Optional<PendingStripeCartCheckout> findBySessionId(String sessionId);
}
