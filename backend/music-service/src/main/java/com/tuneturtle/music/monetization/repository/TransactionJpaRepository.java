package com.tuneturtle.music.monetization.repository;

import com.tuneturtle.music.monetization.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionJpaRepository extends JpaRepository<TransactionEntity, Long> {
    List<TransactionEntity> findByFanId(String fanId);
    List<TransactionEntity> findByArtistId(String artistId);

    // Specific access check queries
    java.util.Optional<TransactionEntity> findTopByFanIdAndItemIdAndTypeAndExpiryDateAfterOrderByCreatedAtDesc(
        String fanId, String itemId, String type, java.time.LocalDateTime now
    );

    java.util.Optional<TransactionEntity> findTopByFanIdAndArtistIdAndTypeAndExpiryDateAfterOrderByCreatedAtDesc(
        String fanId, String artistId, String type, java.time.LocalDateTime now
    );
    
    // Check if any purchase (even expired) exists for reason reporting
    java.util.Optional<TransactionEntity> findTopByFanIdAndItemIdAndTypeOrderByCreatedAtDesc(
        String fanId, String itemId, String type
    );

    @org.springframework.data.jpa.repository.Query("SELECT SUM(t.artistEarnings) FROM TransactionEntity t WHERE t.artistId = :artistId")
    Double sumTotalEarnings(String artistId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(t.artistEarnings) FROM TransactionEntity t WHERE t.artistId = :artistId AND t.createdAt >= :since")
    Double sumEarningsSince(String artistId, java.time.LocalDateTime since);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(t) FROM TransactionEntity t WHERE t.artistId = :artistId")
    Long countTotalSales(String artistId);

    @org.springframework.data.jpa.repository.Query("SELECT t FROM TransactionEntity t WHERE t.artistId = :artistId ORDER BY t.createdAt DESC")
    List<TransactionEntity> findRecentByArtistId(String artistId, org.springframework.data.domain.Pageable pageable);
}
