package com.prince.collab.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "room_participants")
@Getter
@Setter
public class RoomParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "guest_name", length = 50)
    private String guestName;

    @Column(name = "cursor_color", length = 7)
    private String cursorColor;

    @Column(name = "joined_at")
    private Instant joinedAt = Instant.now();

    @Column(name = "left_at")
    private Instant leftAt;
}