package com.prince.collab.dto;

import com.prince.collab.entity.Room;

import java.time.Instant;
import java.util.UUID;

public record RoomResponse(
        UUID roomId,
        String name,
        String language,
        Instant createdAt,
        boolean isActive,
        boolean guestsCanEdit,
        Instant lastActiveAt
) {
    public static RoomResponse from(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getLanguage(),
                room.getCreatedAt(),
                room.isActive(),
                room.isGuestsCanEdit(),
                room.getLastActiveAt()
        );
    }
}