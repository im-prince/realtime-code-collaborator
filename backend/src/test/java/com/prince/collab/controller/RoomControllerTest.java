package com.prince.collab.controller;

import com.prince.collab.entity.Room;
import com.prince.collab.service.DocumentSnapshotService;
import com.prince.collab.service.RoomService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoomController.class)
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoomService roomService;

    @MockitoBean
    private DocumentSnapshotService snapshotService;

    @Test
    void returns201WhenARoomIsCreated() throws Exception {
        Room room = new Room();
        room.setName("Mock Interview");
        room.setLanguage("java");
        room.setCreatedAt(Instant.now());
        room.setLastActiveAt(Instant.now());

        when(roomService.createRoom(anyString(), anyString(), anyBoolean(), any()))
                .thenReturn(room);

        mockMvc.perform(post("/api/v1/rooms")
                        .contentType("application/json")
                        .content("{\"name\":\"Mock Interview\",\"language\":\"java\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Mock Interview"));
    }

    @Test
    void returns400WhenTheNameIsMissing() throws Exception {
        mockMvc.perform(post("/api/v1/rooms")
                        .contentType("application/json")
                        .content("{\"language\":\"java\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returns404WhenTheRoomDoesNotExist() throws Exception {
        UUID missing = UUID.randomUUID();
        when(roomService.getRoom(missing))
                .thenThrow(new EntityNotFoundException("Room not found"));

        mockMvc.perform(get("/api/v1/rooms/" + missing))
                .andExpect(status().isNotFound());
    }
}