import { useState } from 'react';

export default function AskName({ roomName, onDone }) {
  const [name, setName] = useState('');

  function submit(e) {
    e.preventDefault();

    const clean = name.trim();
    if (!clean) return;

    localStorage.setItem('name', clean);
    onDone(clean);
  }

  return (
    <div className="relative grid h-screen place-items-center px-6">
      <div className="blob" style={{ '--blobTint': 'rgba(34,211,238,.14)', top: '20%', left: '25%' }} />

      <form onSubmit={submit} className="glass relative w-full max-w-[400px] p-7">
        <p className="font-mono text-[10px] tracking-widest text-[var(--tx3)]">JOINING</p>
        <h1 className="mt-2 truncate text-xl font-bold text-[var(--tx)]">{roomName}</h1>

        <label className="mt-6 block text-sm text-[var(--tx2)]">What should we call you?</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Priya"
          maxLength={50}
          autoFocus
          required
          className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-4 text-[var(--tx)] outline-none placeholder:text-[var(--tx3)] focus:border-[var(--accent)]"
        />

        <p className="mt-2 text-xs text-[var(--tx3)]">
          Shown on your cursor and in the participants list.
        </p>

        <button
          type="submit"
          className="mt-6 h-12 w-full rounded-xl bg-[var(--accent)] font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90"
        >
          Join room
        </button>
      </form>
    </div>
  );
}