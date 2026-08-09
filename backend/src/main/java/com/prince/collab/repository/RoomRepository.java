package com.prince.collab.repository;

import com.prince.collab.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.Instant;

import java.util.List;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    List<Room> findByCreatedByIdOrderByLastActiveAtDesc(Long userId);

    @Modifying
    @Query("update Room r set r.isActive = false " +
            "where r.isActive = true and r.lastActiveAt < :cutoff")
    int closeRoomsIdleSince(@Param("cutoff") Instant cutoff);
}