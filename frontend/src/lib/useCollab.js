import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { getSnapshot, getToken } from './api.js';

const WS = import.meta.env.VITE_WS_URL;

const colors = ['#22D3EE', '#F472B6', '#A3E635', '#FBBF24', '#A78BFA', '#FB7185'];

export function useCollab(roomId, editor, name, isCreator) {
  const [status, setStatus] = useState('loading');
  const [peers, setPeers] = useState([]);
  const docRef = useRef(null);
  const awarenessRef = useRef(null);

  useEffect(() => {
   if (!editor || !name) return;
    const doc = new Y.Doc();
    docRef.current = doc;
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

      awarenessRef.current = provider.awareness;

      function readPeers() {
        const everyone = [...provider.awareness.getStates().entries()]
          .filter(([, state]) => state.user)
          .sort((a, b) => a[0] - b[0]);

        setPeers(
          everyone.map(([id, state], i) => ({
            ...state.user,
            id,
            isMe: id === doc.clientID,
            color: colors[i % colors.length],
          }))
        );
      }

      provider.awareness.on('change', readPeers);

      provider.awareness.setLocalStateField('user', {
        name,
        isCreator,
        isGuest: !getToken(),
      });

      readPeers();

      binding = new MonacoBinding(
        doc.getText('monaco'),
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );

      provider.on('status', (e) => {
        setStatus(e.status === 'connected' ? 'connected' : 'reconnecting');
      });

      setStatus('reconnecting');
    }

    start();

    return () => {
      stopped = true;
      binding?.destroy();
      provider?.destroy();
      awarenessRef.current = null;
      doc.destroy();
    };
  }, [roomId, editor, name, isCreator]);

 function publish(extra) {
    const aw = awarenessRef.current;
    if (!aw) return;

    const current = aw.getLocalState()?.user || {};
    aw.setLocalStateField('user', { ...current, ...extra });
  }

  return { status, peers, doc: docRef.current, publish };
}