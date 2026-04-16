package com.tuneturtle.music.access.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class AccessResponse {
    private boolean hasAccess;
    private AccessReason reason;
    private LocalDateTime validUntil;
    private boolean isExpired;
}
