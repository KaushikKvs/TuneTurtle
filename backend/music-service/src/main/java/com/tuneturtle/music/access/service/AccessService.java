package com.tuneturtle.music.access.service;

import com.tuneturtle.music.access.dto.AccessReason;
import com.tuneturtle.music.access.dto.AccessResponse;
import com.tuneturtle.music.catalog.document.Album;
import com.tuneturtle.music.catalog.document.Song;
import com.tuneturtle.music.catalog.repository.AlbumRepository;
import com.tuneturtle.music.catalog.repository.SongRepository;
import com.tuneturtle.music.monetization.entity.TransactionEntity;
import com.tuneturtle.music.monetization.repository.TransactionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccessService {

    private final TransactionJpaRepository transactionJpaRepository;
    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;

    public AccessResponse checkAccess(String userId, String contentId) {
        LocalDateTime now = LocalDateTime.now();

        // 1. Resolve Content (Song or Album)
        Optional<Song> songOpt = songRepository.findById(contentId);
        if (songOpt.isPresent()) {
            return checkSongAccess(userId, songOpt.get(), now);
        }

        Optional<Album> albumOpt = albumRepository.findById(contentId);
        if (albumOpt.isPresent()) {
            return checkAlbumAccess(userId, albumOpt.get(), now);
        }

        return AccessResponse.builder()
                .hasAccess(false)
                .reason(AccessReason.NONE)
                .build();
    }

    private AccessResponse checkSongAccess(String userId, Song song, LocalDateTime now) {
        // Rule 1: Free Content
        if (Boolean.TRUE.equals(song.getIsFree())) {
            return AccessResponse.builder().hasAccess(true).reason(AccessReason.FREE).build();
        }

        // Rule 2: Artist Self-Ownership
        if (userId != null && String.valueOf(song.getArtistId()).trim().equals(userId.trim())) {
            return AccessResponse.builder().hasAccess(true).reason(AccessReason.OWNED).build();
        }

        // Rule 3: Individual Song Purchase (Postgres as Source of Truth)
        Optional<TransactionEntity> songTx = transactionJpaRepository
                .findTopByFanIdAndItemIdAndTypeAndExpiryDateAfterOrderByCreatedAtDesc(userId, song.getId(), "SONG", now);
        if (songTx.isPresent()) {
            return AccessResponse.builder()
                    .hasAccess(true)
                    .reason(AccessReason.PURCHASED)
                    .validUntil(songTx.get().getExpiryDate())
                    .build();
        }

        // Rule 4: Album Purchase (Unlock Songs in Album)
        if (song.getAlbum() != null) {
            Optional<Album> parentAlbum = albumRepository.findByName(song.getAlbum());
            if (parentAlbum.isPresent()) {
                Optional<TransactionEntity> albumTx = transactionJpaRepository
                        .findTopByFanIdAndItemIdAndTypeAndExpiryDateAfterOrderByCreatedAtDesc(userId, parentAlbum.get().getId(), "ALBUM", now);
                if (albumTx.isPresent()) {
                    return AccessResponse.builder()
                            .hasAccess(true)
                            .reason(AccessReason.ALBUM_PURCHASE)
                            .validUntil(albumTx.get().getExpiryDate())
                            .build();
                }
            }
        }

        // Rule 5: Artist Subscription
        Optional<TransactionEntity> subTx = transactionJpaRepository
                .findTopByFanIdAndArtistIdAndTypeAndExpiryDateAfterOrderByCreatedAtDesc(userId, song.getArtistId(), "SUBSCRIPTION", now);
        if (subTx.isPresent()) {
            return AccessResponse.builder()
                    .hasAccess(true)
                    .reason(AccessReason.SUBSCRIPTION)
                    .validUntil(subTx.get().getExpiryDate())
                    .build();
        }

        // Check for Expired states to give better feedback
        Optional<TransactionEntity> expiredTx = transactionJpaRepository
                .findTopByFanIdAndItemIdAndTypeOrderByCreatedAtDesc(userId, song.getId(), "SONG");
        if (expiredTx.isPresent()) {
            return AccessResponse.builder()
                    .hasAccess(false)
                    .isExpired(true)
                    .reason(AccessReason.EXPIRED)
                    .validUntil(expiredTx.get().getExpiryDate())
                    .build();
        }

        return AccessResponse.builder().hasAccess(false).reason(AccessReason.NONE).build();
    }

    private AccessResponse checkAlbumAccess(String userId, Album album, LocalDateTime now) {
        // Rule 1: Free Album
        if (Boolean.TRUE.equals(album.getIsFree())) {
            return AccessResponse.builder().hasAccess(true).reason(AccessReason.FREE).build();
        }

        // Rule 2: Artist Ownership
        if (userId != null && String.valueOf(album.getArtistId()).trim().equals(userId.trim())) {
            return AccessResponse.builder().hasAccess(true).reason(AccessReason.OWNED).build();
        }

        // Rule 3: Direct Album Purchase
        Optional<TransactionEntity> albumTx = transactionJpaRepository
                .findTopByFanIdAndItemIdAndTypeAndExpiryDateAfterOrderByCreatedAtDesc(userId, album.getId(), "ALBUM", now);
        if (albumTx.isPresent()) {
            return AccessResponse.builder()
                    .hasAccess(true)
                    .reason(AccessReason.PURCHASED)
                    .validUntil(albumTx.get().getExpiryDate())
                    .build();
        }
        
        // Rule 4: Artist Subscription
        Optional<TransactionEntity> subTx = transactionJpaRepository
                .findTopByFanIdAndArtistIdAndTypeAndExpiryDateAfterOrderByCreatedAtDesc(userId, album.getArtistId(), "SUBSCRIPTION", now);
        if (subTx.isPresent()) {
            return AccessResponse.builder()
                    .hasAccess(true)
                    .reason(AccessReason.SUBSCRIPTION)
                    .validUntil(subTx.get().getExpiryDate())
                    .build();
        }

        return AccessResponse.builder().hasAccess(false).reason(AccessReason.NONE).build();
    }
}
