package com.prince.collab.service;

import com.prince.collab.entity.Room;
import com.prince.collab.entity.RoomParticipant;
import com.prince.collab.repository.RoomParticipantRepository;
import com.prince.collab.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomParticipantService {

    private static final List<String> CURSOR_COLORS = List.of(
            "#F26D6D", "#4CB4B0", "#4A8FE0", "#E0A23C", "#9B72CF", "#3FA96A"
    );

    private final RoomParticipantRepository participantRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public Long join(UUID roomId, String guestName) {
        Room room = roomRepository.findById(roomId).orElse(null);

        if (room == null) {
            log.warn("Participant joined unknown room {}", roomId);
            return null;
        }

        RoomParticipant participant = new RoomParticipant();
        participant.setRoom(room);
        participant.setGuestName(guestName);
        participant.setCursorColor(pickColor());

        room.setLastActiveAt(Instant.now());

        return participantRepository.save(participant).getId();
    }

    @Transactional
    public void leave(Long participantId) {
        if (participantId == null) {
            return;
        }

        participantRepository.findById(participantId)
                .ifPresent(participant -> participant.setLeftAt(Instant.now()));
    }

    private String pickColor() {
        int index = ThreadLocalRandom.current().nextInt(CURSOR_COLORS.size());
        return CURSOR_COLORS.get(index);
    }
}