package com.prince.collab.service;

import com.prince.collab.entity.DocumentSnapshot;
import com.prince.collab.entity.Room;
import com.prince.collab.repository.DocumentSnapshotRepository;
import com.prince.collab.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentSnapshotService {

    private static final int MAX_SNAPSHOT_BYTES = 5 * 1024 * 1024;

    private final DocumentSnapshotRepository snapshotRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public long save(UUID roomId, byte[] content) {
        if (content == null || content.length == 0) {
            throw new IllegalArgumentException("Snapshot content must not be empty");
        }
        if (content.length > MAX_SNAPSHOT_BYTES) {
            throw new IllegalArgumentException("Snapshot exceeds maximum size");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Room not found: " + roomId));

        DocumentSnapshot snapshot = snapshotRepository.findByRoomId(roomId)
                .orElseGet(() -> {
                    DocumentSnapshot created = new DocumentSnapshot();
                    created.setRoom(room);
                    return created;
                });

        snapshot.setContent(content);
        snapshot.setVersion(snapshot.getVersion() + 1);
        snapshot.setUpdatedAt(Instant.now());

        DocumentSnapshot saved = snapshotRepository.save(snapshot);
        log.debug("Saved snapshot v{} for room {} ({} bytes)",
                saved.getVersion(), roomId, content.length);

        return saved.getVersion();
    }

    @Transactional(readOnly = true)
    public Optional<DocumentSnapshot> find(UUID roomId) {
        return snapshotRepository.findByRoomId(roomId);
    }
}