package com.prince.collab.service;

import com.prince.collab.entity.Room;
import com.prince.collab.exception.AccessDeniedException;
import com.prince.collab.repository.RoomRepository;
import com.prince.collab.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    public Room createRoom(String name, String language,boolean guestsCanEdit, Long creatorId) {
        Room room = new Room();
        room.setName(name);
        room.setLanguage(language);
        room.setGuestsCanEdit(guestsCanEdit);

        if (creatorId != null) {
            userRepository.findById(creatorId).ifPresent(room::setCreatedBy);
        }
        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(UUID roomId, Long requesterId) {
        Room room = getRoom(roomId);

        if (room.getCreatedBy() == null) {
            throw new AccessDeniedException("Guest-created rooms cannot be deleted");
        }
        if (requesterId == null || !room.getCreatedBy().getId().equals(requesterId)) {
            throw new AccessDeniedException("Only the room creator can delete this room");
        }

        roomRepository.delete(room);
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsCreatedBy(Long userId) {
        if (userId == null) {
            throw new AccessDeniedException("Sign in to see your rooms");
        }
        return roomRepository.findByCreatedByIdOrderByLastActiveAtDesc(userId);
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