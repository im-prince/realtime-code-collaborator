package com.prince.collab.dto;

import com.prince.collab.entity.Room;
import com.prince.collab.entity.User;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class RoomResponseTest {

//    test for RoomResponse maps every field correctly

    @Test
    void copiesEveryFieldIntoTheRightSlot() {
        // arrange
        Instant created = Instant.parse("2026-01-01T10:00:00Z");
        Instant lastActive = Instant.parse("2026-01-02T15:30:00Z");

        Room room = new Room();
        room.setName("Mock Interview");
        room.setLanguage("java");
        room.setGuestsCanEdit(true);
        room.setActive(false);
        room.setCreatedAt(created);
        room.setLastActiveAt(lastActive);

        // act
        RoomResponse response = RoomResponse.from(room, null);

        // assert
        assertThat(response.name()).isEqualTo("Mock Interview");
        assertThat(response.language()).isEqualTo("java");
        assertThat(response.guestsCanEdit()).isTrue();
        assertThat(response.isActive()).isFalse();
        assertThat(response.createdAt()).isEqualTo(created);
        assertThat(response.lastActiveAt()).isEqualTo(lastActive);
    }
}