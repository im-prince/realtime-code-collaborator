import { Link } from 'react-router-dom';

export default function RoomClosed() {
  return (
    <div className="relative grid min-h-[calc(100vh-67px)] place-items-center px-6">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="blob" style={{ '--blobTint': 'rgba(251,113,133,.12)', top: '25%', left: '35%' }} />

      <div className="relative flex flex-col items-center text-center">
        <div style={{ perspective: '900px' }}>
          <div className="flex items-center" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(14deg) rotateY(-18deg)' }}>
            <div
              className="h-20 w-14 rounded-full border-[6px] border-[var(--border2)]"
              style={{ transform: 'translateZ(20px) rotate(-12deg)', animation: 'flt 8s ease-in-out infinite' }}
            />
            <div
              className="-ml-3 h-20 w-14 rounded-full border-[6px] border-[var(--border2)]"
              style={{ transform: 'translateZ(-20px) rotate(14deg)', animation: 'flt3 9s ease-in-out infinite .7s' }}
            />
          </div>
        </div>

        <p className="mt-10 font-mono text-[11px] tracking-widest text-[var(--danger)]">ROOM CLOSED</p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-[-1px] text-[var(--tx)]">
          This room has closed
        </h1>

        <p className="mt-4 max-w-[400px] text-[var(--tx2)]">
          The host deleted it, or the link was wrong. Snapshots aren't kept once a room closes.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            to="/"
            className="rounded-xl border border-[var(--border)] px-6 py-3 text-[var(--tx2)] transition-colors hover:text-[var(--tx)]"
          >
            Back to home
          </Link>
          <Link
            to="/new"
            className="rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90"
          >
            Create a new room
          </Link>
        </div>
      </div>
    </div>
  );
}