package com.prince.collab.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoomCreateRequest(

        @NotBlank(message = "Room name is required")
        @Size(max = 100, message = "Room name must be at most 100 characters")
        String name,

        @Size(max = 30, message = "Language must be at most 30 characters")
        String language
) {}