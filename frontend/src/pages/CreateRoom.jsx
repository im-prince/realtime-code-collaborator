import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createRoom, getToken } from '../lib/api.js';

const languages = ['Python', 'JavaScript', 'Java', 'TypeScript', 'C++', 'Go', 'Rust', 'SQL'];

export default function CreateRoom() {
  const navigate = useNavigate();
  const signedIn = Boolean(getToken());

  const [name, setName] = useState('');
  const [language, setLanguage] = useState('Java');
  const [guestsCanEdit, setGuestsCanEdit] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const editingOn = signedIn ? guestsCanEdit : true;

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const room = await createRoom(name.trim(), language.toLowerCase(), editingOn);
      const link = `${location.origin}/room/${room.roomId}`;

      try {
        await navigator.clipboard.writeText(link);
      } catch {
        // clipboard can be blocked — the room still opens, and there's a copy button inside
      }

      navigate(`/room/${room.roomId}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="relative grid min-h-[calc(100vh-67px)] place-items-center px-6 py-8">
      <div className="blob" style={{ '--blobTint': 'rgba(34,211,238,.10)', top: 40, left: '15%' }} />

      <div className="relative w-full max-w-[740px]">
        <h1 className="text-center text-[32px] font-extrabold tracking-[-1.2px] text-[var(--tx)]">
          Set up the room
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--tx2)]">
          Two settings, then you get a link to share.
        </p>

        <form onSubmit={submit} className="glass mt-6 p-7">
          <label className="block text-sm text-[var(--tx2)]">Room name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Backend screen — Devon"
            maxLength={100}
            required
            className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-4 text-[var(--tx)] outline-none placeholder:text-[var(--tx3)] focus:border-[var(--accent)]"
          />

          <label className="mt-5 block text-sm text-[var(--tx2)]">Language</label>
          <div className="mt-2 grid grid-cols-4 gap-2.5">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`h-11 rounded-xl border font-mono text-sm transition-colors ${
                  language === lang
                    ? 'chip-on'
                    : 'border-[var(--border)] text-[var(--tx2)] hover:border-[var(--border2)] hover:text-[var(--tx)]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-6 rounded-xl border border-[var(--border)] px-4 py-3.5">
            <div>
              <p className="font-semibold text-[var(--tx)]">Let guests edit</p>
              <p className="mt-1 text-sm text-[var(--tx3)]">
                {signedIn
                  ? 'Off means they can watch and highlight only.'
                  : 'Guest rooms have no host, so editing stays on for everyone.'}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={editingOn}
              disabled={!signedIn}
              onClick={() => setGuestsCanEdit(!guestsCanEdit)}
              className={`h-8 w-14 shrink-0 rounded-full p-1 transition-colors disabled:opacity-40 ${
                editingOn ? 'bg-[var(--accent)]' : 'bg-[var(--solid2)]'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transition-transform ${
                  editingOn ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--tx2)]">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            {signedIn ? (
              <span>
                This room is saved to <strong className="text-[var(--tx)]">My Rooms</strong> and only
                you can delete it.
              </span>
            ) : (
              <span>
                You're creating this as a <strong className="text-[var(--tx)]">guest</strong>.{' '}
                <Link to="/signup" className="text-[var(--accent)]">
                  Sign up
                </Link>{' '}
                to keep it after the session ends.
              </span>
            )}
          </p>

          {error && <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-12 rounded-xl border border-[var(--border)] px-8 text-[var(--tx2)] transition-colors hover:text-[var(--tx)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-12 flex-1 rounded-xl bg-[var(--accent)] font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Create room & copy link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}