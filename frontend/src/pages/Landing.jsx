import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroScene from '../components/HeroScene.jsx';

const features = [
  {
    title: 'Cursors you can follow',
    body: 'Every participant gets a color. Selections, name tags, and cursor position all stream in real time.',
  },
  {
    title: 'One file, on purpose',
    body: 'No file tree, no build step. An interview is one problem — the editor stays out of the way.',
  },
  {
    title: 'Snapshots that survive',
    body: 'Drop off Wi-Fi and rejoin on the same line. Signed-in hosts keep every room in their dashboard.',
  },
];

function pullRoomId(text) {
  const match = text.trim().match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return match ? match[0] : null;
}

export default function Landing() {
  const navigate = useNavigate();
  const [joinLink, setJoinLink] = useState('');
  const [badLink, setBadLink] = useState(false);

  function goToRoom(e) {
    e.preventDefault();

    const roomId = pullRoomId(joinLink);

    if (!roomId) {
      setBadLink(true);
      return;
    }

    navigate(`/room/${roomId}`);
  }

  return (
    <div className="relative min-h-[calc(100vh-67px)] overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="blob" style={{ '--blobTint': 'rgba(34,211,238,.16)', top: 120, right: 320 }} />
      <div className="blob" style={{ '--blobTint': 'rgba(244,114,182,.13)', top: 460, right: 80, animationDelay: '.8s' }} />
      <div className="blob" style={{ '--blobTint': 'rgba(245,165,36,.10)', top: 300, left: -60, animationDelay: '1.4s' }} />

      <div className="relative mx-auto max-w-[1240px] px-6 pb-20 pt-16">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(420px,1fr))] items-center gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--tx2)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cursor3)]" />
              Built for mock coding interviews
            </span>

            <h1 className="mt-8 text-[56px] font-extrabold leading-[1.04] tracking-[-2.2px] text-[var(--tx)]">
              One file.<br />
              Two people.<br />
              <span className="text-[var(--accent)]">Zero setup.</span>
            </h1>

            <p className="mt-6 max-w-[430px] text-[17px] leading-relaxed text-[var(--tx2)]">
              Share a link, land in the same editor, and watch each other type. Live cursors,
              live selections, no install, no repo, no screen share lag.
            </p>

            <Link
              to="/new"
              className="mt-10 grid h-[60px] w-full max-w-[520px] place-items-center rounded-2xl bg-[var(--accent)] text-[17px] font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90"
              style={{ boxShadow: '0 18px 40px -18px var(--glow)' }}
            >
              Create a room
            </Link>

            <form onSubmit={goToRoom} className="mt-3 flex w-full max-w-[520px] gap-2">
              <input
                value={joinLink}
                onChange={(e) => {
                  setJoinLink(e.target.value);
                  setBadLink(false);
                }}
                placeholder="Paste a room link to join"
                className="h-[52px] min-w-0 flex-1 rounded-xl border bg-[var(--bg2)] px-4 font-mono text-sm text-[var(--tx)] outline-none placeholder:text-[var(--tx3)] focus:border-[var(--accent)]"
                style={{ borderColor: badLink ? 'var(--dangerLine)' : 'var(--border)' }}
              />
              <button
                type="submit"
                className="h-[52px] shrink-0 rounded-xl border border-[var(--border)] px-5 text-sm text-[var(--tx2)] transition-colors hover:border-[var(--border2)] hover:text-[var(--tx)]"
              >
                Join room
              </button>
            </form>

            <p className="mt-3 max-w-[520px] text-sm" style={{ color: badLink ? 'var(--danger)' : 'var(--tx3)' }}>
              {badLink
                ? "That doesn't look like a room link — paste the whole thing."
                : 'No account needed — guests get everything except saved rooms.'}
            </p>
          </div>

          <HeroScene />
        </div>

        <div className="mt-24 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {features.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--solid)] p-6"
            >
              <p className="font-mono text-xs text-[var(--accent)]">0{i + 1}</p>
              <p className="mt-4 font-semibold text-[var(--tx)]">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tx2)]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}