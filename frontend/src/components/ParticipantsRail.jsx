import { useState } from 'react';

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function badgeFor(person) {
  if (person.isCreator) return 'HOST';
  if (person.isGuest) return 'GUEST';
  return 'SIGNED IN';
}

export default function ParticipantsRail({ peers, roomId, createdAt }) {
  const [copied, setCopied] = useState(false);
  const link = `${location.origin}/room/${roomId}`;

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex w-[232px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--solid)]">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <p className="font-mono text-[10px] tracking-widest text-[var(--tx3)]">IN THIS ROOM</p>
        <span className="font-mono text-xs text-[var(--tx3)]">{peers.length}</span>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2">
        {peers.map((person) => (
          <div key={person.id} className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold"
              style={{
                background: person.color,
                color: '#0B0C0E',
                boxShadow: `0 0 0 2px var(--solid), 0 0 12px ${person.color}99`,
              }}
            >
              {initials(person.name)}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-[var(--tx)]">
                {person.name}
                {person.isMe && <span className="text-[var(--tx3)]"> (you)</span>}
              </span>

              {person.line && (
                <span className="block truncate font-mono text-[11px] text-[var(--tx3)]">
                  Ln {person.line}
                  {person.doing && person.doing !== 'viewing' && ` · ${person.doing}`}
                </span>
              )}
            </span>
            <span className="shrink-0 rounded bg-[var(--solid2)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--tx3)]">
              {badgeFor(person)}
            </span>
          </div>
        ))}

        {peers.length === 0 && (
          <p className="px-2 py-4 text-sm text-[var(--tx3)]">Connecting…</p>
        )}
      </div>

      <div className="border-t border-[var(--border)] p-4">
        <p className="font-mono text-[10px] tracking-widest text-[var(--tx3)]">INVITE</p>

        <p className="mt-2 truncate rounded-lg border border-dashed border-[var(--border)] px-2.5 py-2 font-mono text-[11px] text-[var(--tx2)]">
          {link.replace(/^https?:\/\//, '')}
        </p>

        <button
          onClick={copyLink}
          className="mt-2 h-9 w-full rounded-lg bg-[var(--accent)] text-sm font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90"
        >
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>

      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--tx3)]">Created</span>
          <span className="font-mono text-[var(--tx2)]">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}