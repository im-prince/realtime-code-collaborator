package com.prince.collab.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

@RequiredArgsConstructor
public class CollabWebSocketHandler extends BinaryWebSocketHandler {

    private final RoomRegistry roomRegistry;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String roomId = extractRoomId(session);
        roomRegistry.join(roomId, session);
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        String roomId = extractRoomId(session);
        roomRegistry.broadcastLocal(roomId, message.getPayload().array(), session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String roomId = extractRoomId(session);
        roomRegistry.leave(roomId, session);
    }

    private String extractRoomId(WebSocketSession session) {
        String path = session.getUri().getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }
}