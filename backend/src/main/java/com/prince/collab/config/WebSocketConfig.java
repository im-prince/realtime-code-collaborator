package com.prince.collab.config;

import com.prince.collab.websocket.CollabWebSocketHandler;
import com.prince.collab.websocket.RoomRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final RoomRegistry roomRegistry;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new CollabWebSocketHandler(roomRegistry), "/ws/*")
                .setAllowedOrigins("*");
    }
}