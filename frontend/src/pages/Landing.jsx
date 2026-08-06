import { Link } from 'react-router-dom';
import HeroScene from '../components/HeroScene.jsx';

const features = [
  {
    title: 'Cursors you can follow',
    body: 'Every participant gets a color. Selections, name tags, and caret position all stream in real time.',
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

export default function Landing() {
  return (
    <div className="relative min-h-[calc(100vh-67px)] px-6 py-16">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="blob" style={{ '--blobTint': 'rgba(34,211,238,.18)', top: 80, right: 220 }} />
      <div className="blob" style={{ '--blobTint': 'rgba(244,114,182,.14)', top: 420, right: 60, animationDelay: '.8s' }} />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--tx2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cursor1)]" />
            Built for mock coding interviews
          </span>

          <h1 className="mt-8 text-[56px] font-extrabold leading-[1.05] tracking-[-2.2px] text-[var(--tx)]">
            One file.<br />
            Two people.<br />
            <span className="text-[var(--accent)]">Zero setup.</span>
          </h1>

          <p className="mt-6 max-w-[440px] text-lg text-[var(--tx2)]">
            Share a link, land in the same editor, and watch each other type. Live cursors,
            live selections, no install, no repo, no screen share lag.
          </p>

          <Link
            to="/new"
            className="mt-10 grid h-14 w-full max-w-[520px] place-items-center rounded-xl bg-[var(--accent)] font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90"
          >
            Create a room
          </Link>

          <p className="mt-3 text-sm text-[var(--tx3)]">
            No account needed — guests get everything except saved rooms.
          </p>
        </div>

        < HeroScene /> 
      </div>

      <div className="relative mx-auto mt-20 grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {features.map((item, i) => (
          <div key={item.title} className="glass p-5">
            <p className="font-mono text-xs text-[var(--accent)]">0{i + 1}</p>
            <p className="mt-3 font-semibold text-[var(--tx)]">{item.title}</p>
            <p className="mt-2 text-sm text-[var(--tx2)]">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}