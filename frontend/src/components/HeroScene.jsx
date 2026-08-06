import { useEffect, useRef } from 'react';

export default function HeroScene() {
  const scene = useRef(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = scene.current;

    function tilt(e) {
      const box = el.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width - 0.5;
      const y = (e.clientY - box.top) / box.height - 0.5;

      el.style.transform = `rotateX(${9 - y * 7}deg) rotateY(${-17 + x * 11}deg)`;
    }

    window.addEventListener('mousemove', tilt);
    return () => window.removeEventListener('mousemove', tilt);
  }, []);

  return (
    <div
      className="relative hidden lg:block"
      style={{ perspective: '1500px', perspectiveOrigin: '55% 42%', height: 540 }}
    >
      <div
        ref={scene}
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(9deg) rotateY(-17deg)',
          transition: 'transform .5s cubic-bezier(.2,.7,.3,1)',
        }}
      >
        <div
          className="absolute h-px w-72"
          style={{
            top: 330, left: 20,
            transform: 'translateZ(-40px) rotate(-14deg)',
            background: 'linear-gradient(90deg, transparent, var(--cursor2), transparent)',
            backgroundSize: '200% 100%',
            animation: 'trail 5s linear infinite 1.2s',
          }}
        />

        <div
          className="absolute h-px w-64"
          style={{
            top: 250, left: 210,
            transform: 'translateZ(20px) rotate(8deg)',
            background: 'linear-gradient(90deg, transparent, var(--cursor3), transparent)',
            backgroundSize: '200% 100%',
            animation: 'trail 4.1s linear infinite .6s',
          }}
        />

        <div
          className="glass absolute overflow-hidden"
          style={{ top: 128, left: 44, width: 412, transform: 'translateZ(70px)', animation: 'flt 8s ease-in-out infinite' }}
        >
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-3.5 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--cursor6)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--cursor4)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--cursor3)]" />
            <span className="ml-2 font-mono text-xs text-[var(--tx3)]">two_sum.py</span>
          </div>

          <pre className="px-3.5 py-3 font-mono text-[12.5px] leading-6" style={{ background: 'var(--ed)' }}>
<span style={{ color: 'var(--sxkw)' }}>def</span> <span style={{ color: 'var(--sxfn)' }}>two_sum</span><span style={{ color: 'var(--tx2)' }}>(nums, target):</span>{'\n'}
<span style={{ color: 'var(--tx2)' }}>    seen = </span><span style={{ color: 'var(--sxop)' }}>{'{}'}</span>{'\n'}
<span style={{ color: 'var(--sxkw)' }}>    for</span> <span style={{ color: 'var(--tx2)' }}>i, n </span><span style={{ color: 'var(--sxkw)' }}>in</span> <span style={{ color: 'var(--sxfn)' }}>enumerate</span><span style={{ color: 'var(--tx2)' }}>(nums):</span>{'\n'}
<span style={{ color: 'var(--sxkw)' }}>        if</span> <span style={{ color: 'var(--tx2)' }}>target - n </span><span style={{ color: 'var(--sxkw)' }}>in</span> <span style={{ color: 'var(--tx2)' }}>seen:</span>{'\n'}
<span style={{ color: 'var(--sxkw)' }}>            return</span> <span style={{ color: 'var(--tx2)' }}>[seen[target-n], i]</span>{'\n'}
<span style={{ color: 'var(--tx2)' }}>        seen[n] = i</span>
          </pre>
        </div>

        <div
          className="absolute h-px w-56"
          style={{
            top: 190, left: 320,
            transform: 'translateZ(60px) rotate(-6deg)',
            background: 'linear-gradient(90deg, transparent, var(--cursor1), transparent)',
            backgroundSize: '200% 100%',
            animation: 'trail 3.2s linear infinite',
          }}
        />

        <div
          className="glass absolute p-4"
          style={{ top: 24, left: 268, width: 244, transform: 'translateZ(150px)', animation: 'flt2 7s ease-in-out infinite .9s' }}
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-widest text-[var(--tx3)]">IN THIS ROOM</p>
            <span className="rounded bg-[var(--solid2)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--tx3)]">HOST</span>
          </div>

          <div className="mt-3 space-y-2.5">
            <p className="flex items-center gap-2 text-sm text-[var(--tx)]">
              <span className="h-2 w-2 rounded-full bg-[var(--cursor1)]" /> Maya Chen
            </p>
            <p className="flex items-center gap-2 text-sm text-[var(--tx)]">
              <span className="h-2 w-2 rounded-full bg-[var(--cursor2)]" /> Devon P.
            </p>
            <p className="flex items-center gap-2 text-sm text-[var(--tx)]">
              <span className="h-2 w-2 rounded-full bg-[var(--cursor3)]" /> A. Rivera
            </p>
          </div>
        </div>

        <div
          className="absolute rounded-md px-2 py-1 text-[11px] font-bold"
          style={{
            top: 300, left: 240,
            transform: 'translateZ(200px)',
            background: 'var(--cursor2)',
            color: '#22060F',
            animation: 'flt3 6s ease-in-out infinite .4s',
          }}
        >
          Devon typing…
        </div>
      </div>
    </div>
  );
}