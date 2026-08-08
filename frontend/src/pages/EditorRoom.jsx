import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getRoom, deleteRoom, shortId } from '../lib/api.js';
import ThemeToggle from '../components/ThemeToggle.jsx';
import ParticipantsRail from '../components/ParticipantsRail.jsx';
import RoomLoading from '../components/RoomLoading.jsx';
import AskName from '../components/AskName.jsx';
import ReconnectToast from '../components/ReconnectToast.jsx';
import { useTheme } from '../lib/useTheme.js';
import { useCollab } from '../lib/useCollab.js';
import { useSnapshot } from '../lib/useSnapshot.js';
import { registerThemes } from '../lib/editorTheme.js';
import { paintPeers } from '../lib/peerStyles.js';

export default function EditorRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const editor = useRef(null);
  const monaco = useRef(null);

  const [room, setRoom] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editorReady, setEditorReady] = useState(null);
  const [myName, setMyName] = useState(() => localStorage.getItem('name'));
  const [spot, setSpot] = useState({ line: 1, col: 1 });
  const [now, setNow] = useState(Date.now());

  const { status, peers, doc } = useCollab(roomId, editorReady, myName, room?.isCreator ?? false);

  const savedAt = useSnapshot(roomId, doc, status === 'connected');

  const canEdit = room ? room.guestsCanEdit || room.isCreator : true;

  useEffect(() => {
    paintPeers(peers);
  }, [peers]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getRoom(roomId)
      .then(setRoom)
      .catch(() => navigate('/closed', { replace: true }));
  }, [roomId, navigate]);

  async function copyLink() {
    await navigator.clipboard.writeText(`${location.origin}/room/${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function removeRoom() {
    if (!confirm('Delete this room? Everyone gets kicked out and the snapshot goes too.')) return;

    try {
      await deleteRoom(roomId);
      navigate('/rooms');
    } catch (err) {
      alert(err.message);
    }
  }

  function onEditorReady(instance, monacoApi) {
    editor.current = instance;
    monaco.current = monacoApi;
    setEditorReady(instance);

    registerThemes(monacoApi);
    monacoApi.editor.setTheme(theme === 'light' ? 'collab-light' : 'collab-dark');

    instance.onDidChangeCursorPosition((e) => {
      setSpot({ line: e.position.lineNumber, col: e.position.column });
    });
  }

  useEffect(() => {
    if (!monaco.current) return;
    monaco.current.editor.setTheme(theme === 'light' ? 'collab-light' : 'collab-dark');
  }, [theme]);

  if (!room) {
    return <RoomLoading />;
  }

  if (!myName) {
    return <AskName roomName={room.name} onDone={setMyName} />;
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-[46px] shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--solid)] px-3">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-[var(--accent)] text-xs text-[var(--accentInk)]">
          ◈
        </span>

        <span className="truncate text-sm font-semibold text-[var(--tx)]">{room.name}</span>

        <span className="shrink-0 rounded border border-[var(--border)] px-2 py-0.5 font-mono text-xs text-[var(--tx2)]">
          {room.language}
        </span>

        <button
          onClick={copyLink}
          className="shrink-0 rounded border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--tx2)] hover:text-[var(--tx)]"
        >
          {copied ? 'Copied' : `Copy ${shortId(roomId)}`}
        </button>

        {!canEdit && (
          <span className="shrink-0 rounded border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--tx3)]">
            Read only
          </span>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: status === 'connected' ? 'var(--ok)' : 'var(--accent)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
            {status === 'connected' ? 'Connected' : 'Reconnecting'}
          </span>

          {room.isCreator && (
            <button
              onClick={removeRoom}
              className="rounded border border-[var(--dangerLine)] px-2.5 py-1 text-xs text-[var(--danger)] hover:bg-[var(--dangerFill)]"
            >
              Delete room
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1">
          <Editor
            height="100%"
            language={room.language}
            onMount={onEditorReady}
            options={{
              fontFamily: 'JetBrains Mono',
              fontSize: 13.5,
              lineHeight: 24,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: 4,
              padding: { top: 12 },
              readOnly: !canEdit,
            }}
          />

          {status !== 'connected' && <ReconnectToast />}
        </div>

        <ParticipantsRail peers={peers} roomId={roomId} createdAt={room.createdAt} />
      </div>

      <div className="flex h-[26px] shrink-0 items-center gap-4 border-t border-[var(--border)] bg-[var(--solid)] px-3 font-mono text-[11px] text-[var(--tx3)]">
        <span>Ln {spot.line}, Col {spot.col}</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>{room.language}</span>

        {savedAt && (
          <span className="ml-auto">snapshot saved {Math.round((now - savedAt) / 1000)}s ago</span>
        )}
      </div>
    </div>
  );
}