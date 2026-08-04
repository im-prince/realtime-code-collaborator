package com.prince.collab.websocket;

import com.prince.collab.service.RoomParticipantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.net.URLDecoder;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
public class CollabWebSocketHandler extends BinaryWebSocketHandler {

    private static final String PARTICIPANT_ID_ATTRIBUTE = "participantId";
    private static final String DEFAULT_GUEST_NAME = "Anonymous";

    private final RoomRegistry roomRegistry;
    private final RoomParticipantService participantService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String roomKey = extractRoomKey(session);
        roomRegistry.join(roomKey, session);

        UUID roomId = parseRoomId(roomKey);
        if (roomId == null) {
            return;
        }

        Long participantId = participantService.join(roomId, extractGuestName(session));
        if (participantId != null) {
            session.getAttributes().put(PARTICIPANT_ID_ATTRIBUTE, participantId);
        }
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        roomRegistry.broadcastLocal(
                extractRoomKey(session),
                message.getPayload().array(),
                session
        );
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        roomRegistry.leave(extractRoomKey(session), session);

        Object participantId = session.getAttributes().get(PARTICIPANT_ID_ATTRIBUTE);
        if (participantId instanceof Long id) {
            participantService.leave(id);
        }
    }

    private String extractRoomKey(WebSocketSession session) {
        String path = session.getUri().getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }

    private UUID parseRoomId(String roomKey) {
        try {
            return UUID.fromString(roomKey);
        } catch (IllegalArgumentException ex) {
            log.warn("Connection opened with non-UUID room key: {}", roomKey);
            return null;
        }
    }

    private String extractGuestName(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null || uri.getQuery() == null) {
            return DEFAULT_GUEST_NAME;
        }

        for (String pair : uri.getQuery().split("&")) {
            String[] parts = pair.split("=", 2);
            if (parts.length == 2 && "name".equals(parts[0])) {
                String decoded = URLDecoder.decode(parts[1], StandardCharsets.UTF_8);
                return decoded.isBlank() ? DEFAULT_GUEST_NAME : decoded;
            }
        }

        return DEFAULT_GUEST_NAME;
    }
}