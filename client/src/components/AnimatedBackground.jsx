import React, { useEffect, useRef, memo } from 'react';

/**
 * AnimatedBackground - Clean, high-tech animated background with pure glowing geometric particles
 * Features:
 * 1. Clearly visible glowing geometric particles & luminous bokeh orbs (NO currency signs)
 * 2. Real-time Cursor Spotlight / Glow tracking
 * 3. Fluid Morphing Aurora Mesh Gradients
 * 4. Animated Cyber Dot Matrix Grid
 */
const AnimatedBackground = ({ currentAccent }) => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Smooth Lerp animation for mouse spotlight
    const animateSpotlight = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(animateSpotlight);
    };

    animId = requestAnimationFrame(animateSpotlight);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const accentColor = currentAccent?.primary || '#6366f1';

  // Clearly visible pure geometric particles (circles, glowing gems, radiant rings)
  const particlesList = [
    { size: 24, left: '6%', delay: '0s', duration: '14s', color: accentColor, type: 'orb' },
    { size: 16, left: '15%', delay: '-3s', duration: '18s', color: '#10B981', type: 'ring' },
    { size: 32, left: '25%', delay: '-7s', duration: '16s', color: '#38BDF8', type: 'orb' },
    { size: 18, left: '36%', delay: '-2s', duration: '20s', color: '#EC4899', type: 'ring' },
    { size: 28, left: '46%', delay: '-10s', duration: '15s', color: '#F59E0B', type: 'orb' },
    { size: 20, left: '56%', delay: '-5s', duration: '17s', color: accentColor, type: 'ring' },
    { size: 34, left: '68%', delay: '-12s', duration: '19s', color: '#10B981', type: 'orb' },
    { size: 16, left: '78%', delay: '-4s', duration: '13s', color: '#8B5CF6', type: 'ring' },
    { size: 30, left: '88%', delay: '-8s', duration: '16s', color: '#06B6D4', type: 'orb' },
    { size: 22, left: '95%', delay: '-1s', duration: '21s', color: '#F472B6', type: 'ring' },
  ];

  return (
    <div className="animated-bg-wrapper">
      {/* 1. Cyber Dot Matrix Pattern */}
      <div className="bg-cyber-grid" />

      {/* 2. Interactive Cursor Spotlight */}
      <div
        ref={spotlightRef}
        className="bg-cursor-spotlight"
        style={{
          background: `radial-gradient(circle 380px at center, ${accentColor}30 0%, ${accentColor}12 40%, transparent 70%)`,
        }}
      />

      {/* 3. Fluid Morphing Lava Aurora Blobs */}
      <div className="aurora-blob aurora-blob-1" style={{ filter: 'blur(80px)' }} />
      <div className="aurora-blob aurora-blob-2" style={{ filter: 'blur(80px)' }} />
      <div className="aurora-blob aurora-blob-3" style={{ filter: 'blur(80px)' }} />
      <div className="aurora-blob aurora-blob-4" style={{ filter: 'blur(80px)' }} />

      {/* 4. Clearly Visible Pure Glowing Geometric Particles & Bokeh Orbs */}
      <div className="glowing-bokeh-group">
        {particlesList.map((p, idx) => (
          <span
            key={idx}
            className={`floating-particle-node ${p.type === 'ring' ? 'particle-ring' : 'particle-orb'}`}
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: p.duration,
              animationDelay: p.delay,
              background:
                p.type === 'ring'
                  ? 'transparent'
                  : `radial-gradient(circle, ${p.color} 0%, ${p.color}88 45%, ${p.color}15 70%, transparent 100%)`,
              borderColor: p.type === 'ring' ? p.color : 'transparent',
              boxShadow: `0 0 20px ${p.color}`,
            }}
          />
        ))}

        {/* Ambient smaller micro-sparkles */}
        {[...Array(14)].map((_, i) => {
          const sparkSize = 6 + (i % 3) * 4;
          const sparkColor = i % 2 === 0 ? accentColor : '#34D399';
          return (
            <span
              key={`spark-${i}`}
              className="floating-micro-spark"
              style={{
                left: `${(i * 7.14 + 2) % 100}%`,
                width: `${sparkSize}px`,
                height: `${sparkSize}px`,
                animationDuration: `${9 + (i % 5) * 3}s`,
                animationDelay: `${-(i * 1.8)}s`,
                background: sparkColor,
                boxShadow: `0 0 12px ${sparkColor}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(AnimatedBackground);
