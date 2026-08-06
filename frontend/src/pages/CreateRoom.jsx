import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const room = await createRoom(name.trim(), language.toLowerCase(), guestsCanEdit);
      navigate(`/room/${room.roomId}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="relative grid min-h-[calc(100vh-67px)] place-items-center px-6">
      <div className="blob" style={{ '--blobTint': 'rgba(34,211,238,.12)', top: 40, left: 120 }} />

      <form onSubmit={submit} className="glass relative w-full max-w-[620px] p-8">
        <h1 className="text-2xl font-bold text-[var(--tx)]">Set up the room</h1>

        <label className="mt-7 block text-sm text-[var(--tx2)]">Room name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Backend screen — Devon"
          maxLength={100}
          required
          className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-3.5 text-[var(--tx)] outline-none placeholder:text-[var(--tx3)] focus:border-[var(--accent)]"
        />

        <label className="mt-6 block text-sm text-[var(--tx2)]">Language</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`h-10 rounded-lg border font-mono text-sm transition-colors ${
                language === lang
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--tx2)] hover:text-[var(--tx)]'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-[var(--tx)]">Let guests edit</p>
            <p className="mt-1 text-sm text-[var(--tx3)]">
              Off means they can watch and highlight only.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={guestsCanEdit}
            onClick={() => setGuestsCanEdit(!guestsCanEdit)}
            className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${
              guestsCanEdit ? 'bg-[var(--accent)]' : 'bg-[var(--solid2)]'
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                guestsCanEdit ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        <p className="mt-6 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--tx3)]">
          {signedIn
            ? 'This room will appear in My Rooms, and only you can delete it.'
            : "You're creating this as a guest. It won't appear in My Rooms — keep the link."}
        </p>

        {error && <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 h-12 w-full rounded-xl bg-[var(--accent)] font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Creating…' : 'Create and open'}
        </button>
      </form>
    </div>
  );
}