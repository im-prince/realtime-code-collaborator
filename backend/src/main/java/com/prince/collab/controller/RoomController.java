package com.prince.collab.controller;

import com.prince.collab.dto.RoomCreateRequest;
import com.prince.collab.dto.RoomResponse;
import com.prince.collab.dto.SnapshotResponse;
import com.prince.collab.entity.Room;
import com.prince.collab.security.JwtAuthenticationFilter;
import com.prince.collab.service.DocumentSnapshotService;
import com.prince.collab.service.RoomService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final DocumentSnapshotService snapshotService;

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(
            @Valid @RequestBody RoomCreateRequest request,
            HttpServletRequest httpRequest,
            UriComponentsBuilder uriBuilder) {

        Long creatorId = (Long) httpRequest.getAttribute(
                JwtAuthenticationFilter.USER_ID_ATTRIBUTE);

        Room room = roomService.createRoom(
                request.name(),
                request.language(),
                request.guestsCanEdit() == null || request.guestsCanEdit(),
                creatorId);

        URI location = uriBuilder
                .path("/api/v1/rooms/{roomId}")
                .buildAndExpand(room.getId())
                .toUri();

        return ResponseEntity.created(location).body(RoomResponse.from(room));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable UUID roomId,
            HttpServletRequest request) {

        Long requesterId = (Long) request.getAttribute(
                JwtAuthenticationFilter.USER_ID_ATTRIBUTE);

        roomService.deleteRoom(roomId, requesterId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mine")
    public ResponseEntity<List<RoomResponse>> getMyRooms(HttpServletRequest request) {
        Long requesterId = (Long) request.getAttribute(
                JwtAuthenticationFilter.USER_ID_ATTRIBUTE);

        List<RoomResponse> rooms = roomService.getRoomsCreatedBy(requesterId).stream()
                .map(RoomResponse::from)
                .toList();

        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable UUID roomId) {
        Room room = roomService.getRoom(roomId);
        return ResponseEntity.ok(RoomResponse.from(room));
    }

    @PutMapping("/{roomId}/snapshot")
    public ResponseEntity<Void> saveSnapshot(
            @PathVariable UUID roomId,
            @RequestBody byte[] content) {

        long version = snapshotService.save(roomId, content);
        return ResponseEntity.noContent()
                .header("X-Snapshot-Version", String.valueOf(version))
                .build();
    }

    @GetMapping("/{roomId}/snapshot")
    public ResponseEntity<SnapshotResponse> getSnapshot(@PathVariable UUID roomId) {
        return snapshotService.find(roomId)
                .map(snapshot -> ResponseEntity.ok(SnapshotResponse.from(snapshot)))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
}