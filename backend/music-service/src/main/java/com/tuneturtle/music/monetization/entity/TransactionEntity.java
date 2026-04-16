package com.tuneturtle.music.monetization.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mongoId; // Reference to MongoDB record

    private String fanId;
    private String artistId;
    private String type; // SONG or ALBUM
    private String itemId;
    @Column(unique = true)
    private String paymentReference;
    
    private Double amountPaid;
    private Double platformFee;
    private Double artistEarnings;
    
    private LocalDateTime expiryDate;
    private LocalDateTime createdAt;
}
