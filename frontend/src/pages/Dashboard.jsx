import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyRooms, deleteRoom, shortId } from '../lib/api.js';

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso)) / 60000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} hours ago`;

  return `${Math.floor(mins / 1440)} days ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyRooms()
      .then(setRooms)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function remove(roomId) {
    if (!confirm('Delete this room? The snapshot goes with it.')) return;

    const before = rooms;
    setRooms(rooms.filter((r) => r.roomId !== roomId));

    try {
      await deleteRoom(roomId);
    } catch (err) {
      setRooms(before);
      setError(err.message);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-67px)] px-6 py-12">
      <div className="mx-auto max-w-[1000px]">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-bold text-[var(--tx)]">My rooms</h1>
          <Link
            to="/new"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90"
          >
            New room
          </Link>
        </div>

        {error && <p className="mt-6 text-sm text-[var(--danger)]">{error}</p>}

        {loading && (
          <div className="mt-8 space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="shimmer h-14 rounded-xl"
                style={{ animationDelay: `${i * 0.07}s` }}
              />
            ))}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="glass mt-8 grid place-items-center p-16 text-center">
            <p className="font-semibold text-[var(--tx)]">No rooms yet</p>
            <p className="mt-2 max-w-[340px] text-sm text-[var(--tx2)]">
              Rooms you create while signed in show up here, with their snapshots.
            </p>
            <Link
              to="/new"
              className="mt-6 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accentInk)]"
            >
              Create your first room
            </Link>
          </div>
        )}

        {rooms.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl border border-[var(--border)]">
            <div className="grid grid-cols-[minmax(0,2.4fr)_110px_130px_120px_44px] gap-3.5 border-b border-[var(--border)] bg-[var(--solid2)] px-4 py-2.5 font-mono text-[10px] tracking-widest text-[var(--tx3)]">
              <span>ROOM</span>
              <span>LANGUAGE</span>
              <span>LAST ACTIVE</span>
              <span>STATUS</span>
              <span />
            </div>

            {rooms.map((room) => (
              <div
                key={room.roomId}
                onClick={() => navigate(`/room/${room.roomId}`)}
                className="grid cursor-pointer grid-cols-[minmax(0,2.4fr)_110px_130px_120px_44px] items-center gap-3.5 border-b border-[var(--border)] px-4 py-3 last:border-0 hover:bg-[var(--solid2)]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--tx)]">{room.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-[var(--tx3)]">
                    {shortId(room.roomId)}
                  </p>
                </div>

                <span className="text-sm text-[var(--tx2)]">{room.language}</span>
                <span className="text-sm text-[var(--tx2)]">{timeAgo(room.lastActiveAt)}</span>

                <span
                  className="w-fit rounded-full px-2 py-0.5 text-xs"
                  style={{
                    color: room.isActive ? 'var(--ok)' : 'var(--tx3)',
                    background: room.isActive ? 'var(--okFill)' : 'transparent',
                  }}
                >
                  {room.isActive ? 'Active' : 'Inactive'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(room.roomId);
                  }}
                  aria-label={`Delete ${room.name}`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-[var(--tx3)] hover:bg-[var(--dangerFill)] hover:text-[var(--danger)]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}