package com.prince.collab.repository;

import com.prince.collab.entity.RoomParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, Long> {
    List<RoomParticipant> findByRoomId(UUID roomId);
}