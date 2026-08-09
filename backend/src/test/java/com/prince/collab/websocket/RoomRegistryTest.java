package com.prince.collab.websocket;

import org.junit.jupiter.api.Test;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RoomRegistryTest {

    @Test
    void sendsMessageToOtherPersonInTheRoom() throws IOException {
        // arrange
        RoomRegistry registry = new RoomRegistry();

        WebSocketSession sender = mock(WebSocketSession.class);
        WebSocketSession other = mock(WebSocketSession.class);
        when(other.isOpen()).thenReturn(true);

        registry.join("room1", sender);
        registry.join("room1", other);

        // act
        registry.broadcastLocal("room1", "hello".getBytes(), sender);

        // assert
        verify(other).sendMessage(any(BinaryMessage.class));
    }


    @Test
    void doesNotSendToPeopleInOtherRooms() throws IOException {
        // arrange
        RoomRegistry registry = new RoomRegistry();

        WebSocketSession inRoom1 = mock(WebSocketSession.class);
        WebSocketSession inRoom2 = mock(WebSocketSession.class);
        when(inRoom2.isOpen()).thenReturn(true);

        registry.join("room1", inRoom1);
        registry.join("room2", inRoom2);

        // act
        registry.broadcastLocal("room1", "hello".getBytes(), inRoom1);

        // assert
        verify(inRoom2, never()).sendMessage(any(BinaryMessage.class));
    }
}