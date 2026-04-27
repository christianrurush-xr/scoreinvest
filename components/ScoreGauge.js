'use client';

export default function ScoreGauge({ score, signalColor, size = 100 }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={signalColor} strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontSize: size * 0.3, fontWeight: 700, color: signalColor,
          fontFamily: 'var(--font-display)',
        }}>{score}</div>
        <div style={{ fontSize: size * 0.09, color: 'var(--text-muted)' }}>/ 100</div>
      </div>
    </div>
  );
}
