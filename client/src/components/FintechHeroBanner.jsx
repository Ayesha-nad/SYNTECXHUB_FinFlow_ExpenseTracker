import React, { useEffect, useRef, useState, memo } from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Activity, Zap, Layers, DollarSign } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const FintechHeroBanner = ({ summaryMetrics, monthlyBudget }) => {
  const canvasRef = useRef(null);
  const [healthScore, setHealthScore] = useState(94);
  const { totalSpent = 0, thisMonthSpent = 0, budgetPercent = 0, isOverBudget = false } = summaryMetrics || {};

  // Dynamically calculate financial health score (0 - 100)
  useEffect(() => {
    let score = 100;
    if (isOverBudget) {
      score = Math.max(45, 100 - (budgetPercent - 100) * 1.5);
    } else if (budgetPercent > 80) {
      score = Math.max(70, 100 - (budgetPercent - 80) * 1.2);
    } else {
      score = Math.min(99, 92 + Math.floor(Math.random() * 6));
    }
    setHealthScore(Math.round(score));
  }, [thisMonthSpent, monthlyBudget, budgetPercent, isOverBudget]);

  // Clean, pure geometric particle constellation (no currency signs)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for interactive physics
    let mouse = { x: width / 2, y: height / 2, radius: 130 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Pure geometric particles with glowing nodes and concentric pulses
    const particleCount = Math.min(34, Math.floor(width / 35));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.85,
        vy: (Math.random() - 0.5) * 0.85,
        radius: Math.random() * 3.5 + 3, // 3px to 6.5px
        opacity: Math.random() * 0.4 + 0.6, // 0.6 - 1.0
        color: ['#818CF8', '#34D399', '#38BDF8', '#F472B6', '#FBBF24'][i % 5],
        pulseSpeed: 0.03 + Math.random() * 0.04,
        pulseVal: Math.random() * Math.PI,
        hasRing: i % 2 === 0,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw glowing connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 130) * 0.35;
            ctx.strokeStyle = `rgba(129, 140, 248, ${lineAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // Draw & update pure geometric particles
      particles.forEach((p) => {
        p.pulseVal += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.pulseVal) * 1.5;

        // Mouse repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          p.x -= directionX * force * 4;
          p.y -= directionY * force * 4;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Core solid glowing node
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(2, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Optional concentric glowing ring
        if (p.hasRing) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(5, currentRadius + 4), 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = p.opacity * 0.45;
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Calculate health circle stroke dash
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="fintech-hero-card">
      {/* Interactive Background Particle Mesh Canvas */}
      <canvas ref={canvasRef} className="hero-interactive-canvas" />

      {/* Hero Content Left */}
      <div className="hero-left-content">
        <div className="hero-badge">
          <Activity size={14} className="hero-pulse-dot" />
          <span>Real-Time Intelligence & Cash Flow</span>
        </div>

        <h1 className="hero-headline">
          Master Your Spending with <span>Intelligent Flow</span>
        </h1>

        <p className="hero-subtitle">
          Live financial analytics, automated category aggregation, and instant budget velocity alerts.
        </p>

        {/* Live Graphical Metric Pills */}
        <div className="hero-metric-pills">
          <div className="hero-pill">
            <TrendingUp size={15} style={{ color: '#10B981' }} />
            <span>Budget Pace: <strong>{budgetPercent}%</strong></span>
          </div>
          <div className="hero-pill">
            <Zap size={15} style={{ color: '#F59E0B' }} />
            <span>Active Goal: <strong>${monthlyBudget}</strong></span>
          </div>
          <div className="hero-pill">
            <ShieldCheck size={15} style={{ color: '#818CF8' }} />
            <span>Status: <strong>{isOverBudget ? 'Review Spending' : 'Optimal Pace'}</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Content Right: Graphical Holographic Financial Radar Card */}
      <div className="hero-right-graphic">
        <div className="graphic-hologram-card">
          {/* Circular Animated SVG Health Gauge */}
          <div className="health-gauge-wrapper">
            <svg className="health-gauge-svg" width="96" height="96" viewBox="0 0 96 96">
              {/* Background Track */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="gauge-bg-circle"
                strokeWidth="7"
                fill="none"
              />
              {/* Animated Glowing Progress Arc */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="gauge-progress-circle"
                strokeWidth="7"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 48 48)"
              />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-score"><AnimatedCounter value={healthScore} decimals={0} /></span>
              <span className="gauge-label">SCORE</span>
            </div>
          </div>

          {/* Animated Sine Wave Graphic */}
          <div className="wave-graphic-container">
            <div className="wave-info">
              <span className="wave-title">FINANCIAL HEALTH</span>
              <span className="wave-status" style={{ color: healthScore > 80 ? '#10B981' : '#F59E0B' }}>
                {healthScore > 85 ? 'EXCELLENT' : healthScore > 70 ? 'GOOD' : 'ATTENTION'}
              </span>
            </div>

            {/* SVG Animated Flow Waveform */}
            <svg className="sine-wave-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
              <path
                d="M 0,20 Q 25,5 50,20 T 100,20 T 150,20 T 200,20"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="3"
                className="animated-wave-path"
              />
              <path
                d="M 0,20 Q 25,5 50,20 T 100,20 T 150,20 T 200,20 L 200,40 L 0,40 Z"
                fill="url(#waveFillGradient)"
                className="animated-wave-fill"
              />
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="50%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
                <linearGradient id="waveFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(129, 140, 248, 0.25)" />
                  <stop offset="100%" stopColor="rgba(129, 140, 248, 0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FintechHeroBanner);
