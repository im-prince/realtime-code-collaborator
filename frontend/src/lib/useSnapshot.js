import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { saveSnapshot } from './api.js';

const EVERY = 10000;

export function useSnapshot(roomId, doc, connected) {
  const dirty = useRef(false);
  const saving = useRef(false);
  const saveRef = useRef(null);
  const [savedAt, setSavedAt] = useState(null);

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
        setSavedAt(Date.now());
      } catch {
        dirty.current = true;
      } finally {
        saving.current = false;
      }
    }

    saveRef.current = save;
    doc.on('update', markDirty);
    const timer = setInterval(save, EVERY);

    return () => {
      clearInterval(timer);
      doc.off('update', markDirty);
      save();
      saveRef.current = null;
    };
  }, [roomId, doc, connected]);

  function saveNow() {
    return saveRef.current ? saveRef.current() : Promise.resolve();
  }

  return { savedAt, saveNow };
}