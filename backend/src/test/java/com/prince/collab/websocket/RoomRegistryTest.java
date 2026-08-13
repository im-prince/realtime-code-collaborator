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





    @Test
    void doesNotEchoBackToTheSender() throws IOException {
        // arrange
        RoomRegistry registry = new RoomRegistry();

        WebSocketSession sender = mock(WebSocketSession.class);
        WebSocketSession other = mock(WebSocketSession.class);
        when(sender.isOpen()).thenReturn(true);
        when(other.isOpen()).thenReturn(true);

        registry.join("room1", sender);
        registry.join("room1", other);

        // act
        registry.broadcastLocal("room1", "hello".getBytes(), sender);

        // assert
        verify(sender, never()).sendMessage(any(BinaryMessage.class));
    }


    @Test
    void keepsSendingAfterOneConnectionFails() throws IOException {
        // arrange
        RoomRegistry registry = new RoomRegistry();

        WebSocketSession sender = mock(WebSocketSession.class);
        WebSocketSession broken = mock(WebSocketSession.class);
        WebSocketSession healthy = mock(WebSocketSession.class);

        when(broken.isOpen()).thenReturn(true);
        when(healthy.isOpen()).thenReturn(true);

        doThrow(new IOException("connection reset"))
                .when(broken).sendMessage(any(BinaryMessage.class));

        registry.join("room1", sender);
        registry.join("room1", broken);
        registry.join("room1", healthy);

        // act
        registry.broadcastLocal("room1", "hello".getBytes(), sender);

        // assert
        verify(healthy).sendMessage(any(BinaryMessage.class));
    }
}