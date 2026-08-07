import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { getSnapshot, getToken } from './api.js';

const WS = import.meta.env.VITE_WS_URL;

const colors = ['#22D3EE', '#F472B6', '#A3E635', '#FBBF24', '#A78BFA', '#FB7185'];

export function useCollab(roomId, editor, name, isCreator) {
  const [status, setStatus] = useState('loading');
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    if (!editor) return;

    const doc = new Y.Doc();
    let provider = null;
    let binding = null;
    let stopped = false;

    async function start() {
      const saved = await getSnapshot(roomId).catch(() => null);
      if (stopped) return;

      if (saved) Y.applyUpdate(doc, saved.bytes);

      provider = new WebsocketProvider(`${WS}/ws`, roomId, doc, {
        params: { name },
      });

      provider.awareness.setLocalStateField('user', {
        name,
        isCreator,
        isGuest: !getToken(),
        color: colors[doc.clientID % colors.length],
      });

      binding = new MonacoBinding(
        doc.getText('monaco'),
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );

      provider.on('status', (e) => {
        setStatus(e.status === 'connected' ? 'connected' : 'reconnecting');
      });

      provider.awareness.on('change', () => {
        const everyone = [...provider.awareness.getStates().entries()];

        setPeers(
          everyone
            .filter(([, state]) => state.user)
            .map(([id, state]) => ({ id, isMe: id === doc.clientID, ...state.user }))
        );
      });

      setStatus('reconnecting');
    }

    start();

    return () => {
      stopped = true;
      binding?.destroy();
      provider?.destroy();
      doc.destroy();
    };
  }, [roomId, editor, name, isCreator]);

  return { status, peers };
}