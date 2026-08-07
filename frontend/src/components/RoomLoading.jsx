const lines = [
  { indent: 0, width: 180 },
  { indent: 0, width: 240 },
  { indent: 0, width: 0 },
  { indent: 0, width: 210 },
  { indent: 1, width: 320 },
  { indent: 2, width: 260 },
  { indent: 2, width: 0 },
  { indent: 2, width: 290 },
  { indent: 3, width: 340 },
  { indent: 4, width: 220 },
  { indent: 3, width: 180 },
  { indent: 2, width: 150 },
  { indent: 0, width: 0 },
  { indent: 1, width: 200 },
  { indent: 2, width: 270 },
];

export default function RoomLoading() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-[46px] shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--solid)] px-3">
        <span className="grid h-6 w-6 place-items-center rounded bg-[var(--accent)] text-xs text-[var(--accentInk)]">
          ◈
        </span>
        <div className="shimmer h-3.5 w-40 rounded" />
        <div className="shimmer h-3.5 w-16 rounded" style={{ animationDelay: '.1s' }} />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative flex-1 overflow-hidden" style={{ background: 'var(--ed)' }}>
          <div className="pt-3">
            {lines.map((line, i) => (
              <div key={i} className="flex h-6 items-center">
                <span className="w-[54px] pr-4 text-right font-mono text-[13.5px] leading-6 text-[var(--gut)]">
                  {i + 1}
                </span>
                {line.width > 0 && (
                  <div
                    className="shimmer h-3 rounded"
                    style={{
                      width: line.width,
                      marginLeft: line.indent * 32,
                      animationDelay: `${i * 0.07}s`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-0.5 w-44 overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className="h-full w-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'trail 1.4s linear infinite',
                  }}
                />
              </div>
              <p className="text-sm text-[var(--tx2)]">Fetching room snapshot</p>
            </div>
          </div>
        </div>

        <div className="w-[232px] shrink-0 border-l border-[var(--border)] bg-[var(--solid)] p-4">
          <div className="shimmer h-2.5 w-24 rounded" />
          <div className="mt-4 space-y-3">
            <div className="shimmer h-7 w-full rounded-lg" style={{ animationDelay: '.1s' }} />
            <div className="shimmer h-7 w-full rounded-lg" style={{ animationDelay: '.2s' }} />
          </div>
        </div>
      </div>

      <div className="flex h-[26px] shrink-0 items-center gap-4 border-t border-[var(--border)] bg-[var(--solid)] px-3 font-mono text-[11px] text-[var(--tx3)]">
        <div className="shimmer h-2 w-14 rounded" />
      </div>
    </div>
  );
}