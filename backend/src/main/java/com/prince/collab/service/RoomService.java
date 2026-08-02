package com.prince.collab.service;

import com.prince.collab.entity.Room;
import com.prince.collab.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    @Transactional
    public Room createRoom(String name, String language) {
        Room room = new Room();
        room.setName(name);
        room.setLanguage(language);
        return roomRepository.save(room);
    }

    @Transactional(readOnly = true)
    public Room getRoom(UUID roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Room not found: " + roomId));
    }

    @Transactional
    public void markActive(UUID roomId) {
        roomRepository.findById(roomId)
                .ifPresent(room -> room.setLastActiveAt(Instant.now()));
    }
}