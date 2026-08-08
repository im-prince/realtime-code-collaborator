import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { saveSnapshot } from './api.js';

const EVERY = 10000;

export function useSnapshot(roomId, doc, connected) {
  const dirty = useRef(false);
  const saving = useRef(false);

  useEffect(() => {
    if (!doc || !connected) return;

    function markDirty() {
      dirty.current = true;
    }

    async function save() {
      if (!dirty.current || saving.current) return;

      dirty.current = false;
      saving.current = true;

      try {
        await saveSnapshot(roomId, Y.encodeStateAsUpdate(doc));
      } catch {
        dirty.current = true;
      } finally {
        saving.current = false;
      }
    }

    doc.on('update', markDirty);
    const timer = setInterval(save, EVERY);

    return () => {
      clearInterval(timer);
      doc.off('update', markDirty);
      save();
    };
  }, [roomId, doc, connected]);
}