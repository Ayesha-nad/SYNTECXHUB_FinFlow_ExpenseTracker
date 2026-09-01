import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedCounter component that smoothly animates number transitions with easing
 */
const AnimatedCounter = ({
  value = 0,
  duration = 800,
  prefix = '',
  suffix = '',
  decimals = 2,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const startValRef = useRef(0);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    startValRef.current = displayValue;
    const targetValue = Number(value) || 0;
    const startValue = startValRef.current;
    startTimeRef.current = null;

    // Cubic ease-out function
    const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const current = startValue + (targetValue - startValue) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue || 0);

  return (
    <span className={`animated-counter ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
