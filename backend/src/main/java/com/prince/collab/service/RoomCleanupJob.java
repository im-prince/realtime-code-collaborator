package com.prince.collab.service;

import com.prince.collab.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class RoomCleanupJob {

    private static final Duration IDLE_LIMIT = Duration.ofHours(24);

    private final RoomRepository roomRepository;

    @Scheduled(fixedDelay = 15 * 60 * 1000, initialDelay = 60 * 1000)
    @Transactional
    public void closeIdleRooms() {
        Instant cutoff = Instant.now().minus(IDLE_LIMIT);
        int closed = roomRepository.closeRoomsIdleSince(cutoff);

        if (closed > 0) {
            log.info("Closed {} rooms idle since {}", closed, cutoff);
        }
    }
}