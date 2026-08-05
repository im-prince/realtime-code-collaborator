package com.prince.collab.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "rooms")
@Getter
@Setter
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 30)
    private String language;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "last_active_at")
    private Instant lastActiveAt = Instant.now();

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "guests_can_edit", nullable = false)
    private boolean guestsCanEdit = true;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomParticipant> participants = new ArrayList<>();

    @OneToOne(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private DocumentSnapshot snapshot;
}