package com.prince.collab.config;

import com.prince.collab.service.RoomParticipantService;
import com.prince.collab.websocket.CollabWebSocketHandler;
import com.prince.collab.websocket.RoomRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final RoomRegistry roomRegistry;
    private final RoomParticipantService participantService;

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new CollabWebSocketHandler(roomRegistry, participantService), "/ws/*")
                .setAllowedOrigins(allowedOrigin);
    }
}