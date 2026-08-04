package com.prince.collab.dto;

import com.prince.collab.entity.DocumentSnapshot;

import java.time.Instant;
import java.util.Base64;

public record SnapshotResponse(
        String content,
        long version,
        Instant updatedAt
) {
    public static SnapshotResponse from(DocumentSnapshot snapshot) {
        return new SnapshotResponse(
                Base64.getEncoder().encodeToString(snapshot.getContent()),
                snapshot.getVersion(),
                snapshot.getUpdatedAt()
        );
    }
}