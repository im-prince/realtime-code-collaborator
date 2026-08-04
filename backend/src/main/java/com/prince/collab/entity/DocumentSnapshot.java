package com.prince.collab.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "document_snapshots")
@Getter
@Setter
public class DocumentSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false, unique = true)
    private Room room;


    @Column(columnDefinition = "BYTEA")
    private byte[] content;

    private long version = 0;

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
}