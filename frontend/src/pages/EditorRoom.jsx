import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getRoom, shortId } from '../lib/api.js';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function EditorRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [copied, setCopied] = useState(false);

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

  if (!room) {
    return <div className="h-screen" style={{ background: 'var(--ed)' }} />;
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
          <span className="flex items-center gap-1.5 text-xs text-[var(--tx3)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tx3)]" />
            Offline
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={room.language}
          theme={document.documentElement.dataset.theme === 'light' ? 'light' : 'vs-dark'}
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

      <div className="flex h-[26px] shrink-0 items-center gap-4 border-t border-[var(--border)] bg-[var(--solid)] px-3 font-mono text-[11px] text-[var(--tx3)]">
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>{room.language}</span>
      </div>
    </div>
  );
}