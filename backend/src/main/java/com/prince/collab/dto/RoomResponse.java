package com.prince.collab.dto;

import com.prince.collab.entity.Room;

import java.time.Instant;
import java.util.UUID;

public record RoomResponse(
        UUID roomId,
        String name,
        String language,
        boolean guestsCanEdit,
        boolean isCreator,
        Instant createdAt,
        Instant lastActiveAt,
        boolean isActive
) {
    public static RoomResponse from(Room room, Long requesterId) {
        boolean isCreator = room.getCreatedBy() != null
                && requesterId != null
                && room.getCreatedBy().getId().equals(requesterId);

        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getLanguage(),
                room.isGuestsCanEdit(),
                isCreator,
                room.getCreatedAt(),
                room.getLastActiveAt(),
                room.isActive()
        );
    }
}