package com.prince.collab.repository;

import com.prince.collab.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    List<Room> findByCreatedByIdOrderByLastActiveAtDesc(Long userId);
}