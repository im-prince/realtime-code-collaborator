import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useTheme } from '../lib/useTheme.js';
import { registerThemes } from '../lib/editorTheme.js';
import { getRoom, shortId } from '../lib/api.js';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useCollab } from '../lib/useCollab.js';
import RoomLoading from '../components/RoomLoading.jsx';
import ParticipantsRail from '../components/ParticipantsRail.jsx';

export default function EditorRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const editor = useRef(null);
  const monaco = useRef(null);


  const [room, setRoom] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editorReady, setEditorReady] = useState(null);
  const { status, peers } = useCollab(roomId, editorReady, 'Prince', room?.isCreator ?? false);

  
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

  function onEditorReady(instance, monacoApi) {
    editor.current = instance;
    monaco.current = monacoApi;
    setEditorReady(instance);

    registerThemes(monacoApi);
    monacoApi.editor.setTheme(theme === 'light' ? 'collab-light' : 'collab-dark');
  }

  useEffect(() => {
    if (!monaco.current) return;
    monaco.current.editor.setTheme(theme === 'light' ? 'collab-light' : 'collab-dark');
  }, [theme]);

  if (!room) {
    return <RoomLoading />;
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

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: status === 'connected' ? 'var(--ok)' : 'var(--accent)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
            {status === 'connected' ? 'Connected' : 'Reconnecting'}
            {peers.length > 1 && <span className="text-[var(--tx3)]"> · {peers.length}</span>}
          </span>
          <ThemeToggle />
        </div>
      </div>

     <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
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
          }}
        />
        </div>

        <ParticipantsRail peers={peers} roomId={roomId} createdAt={room.createdAt} />
      </div>

      <div className="flex h-[26px] shrink-0 items-center gap-4 border-t border-[var(--border)] bg-[var(--solid)] px-3 font-mono text-[11px] text-[var(--tx3)]">
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>{room.language}</span>
      </div>
    </div>
  );
}