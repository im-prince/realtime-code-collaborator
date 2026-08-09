package com.prince.collab.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Slf4j
@Component
public class RoomRegistry {

    private final ConcurrentHashMap<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();

    public void join(String roomId, WebSocketSession session) {
        rooms.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>()).add(session);
    }

    public void leave(String roomId, WebSocketSession session) {
        Set<WebSocketSession> sessions = rooms.get(roomId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                rooms.remove(roomId);
            }
        }
    }

    public void broadcastLocal(String roomId, byte[] payload, WebSocketSession sender) {
        Set<WebSocketSession> sessions = rooms.get(roomId);
        if (sessions == null) return;

        for (WebSocketSession s : sessions) {
            if (s.equals(sender) || !s.isOpen()) continue;
            try {
                s.sendMessage(new BinaryMessage(payload));
            } catch (IOException e) {
                log.warn("Failed to send to session {} in room {}", s.getId(), roomId, e);
            }
        }
    }
}