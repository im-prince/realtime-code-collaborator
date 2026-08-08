export default function ReconnectToast() {
  return (
    <div
      className="glass pointer-events-none absolute left-1/2 top-5 z-10 flex items-center gap-2.5 px-4 py-3"
      style={{ transform: 'translateX(-50%)', animation: 'toastIn .3s cubic-bezier(.2,.7,.3,1)' }}
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
        style={{ animation: 'blink 1.1s steps(1) infinite' }}
      />
      <p className="text-sm text-[var(--tx)]">
        <strong className="font-semibold">Reconnecting</strong>
        <span className="text-[var(--tx2)]"> — your edits are queued locally.</span>
      </p>
    </div>
  );
}