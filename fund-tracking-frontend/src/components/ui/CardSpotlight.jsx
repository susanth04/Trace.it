import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React, { useState } from "react";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className = "",
  style = {},
  ...props
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  return (
    <div
      style={{
        position: 'relative',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        ...style
      }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '12px',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.3s',
          background: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.4),
              transparent 80%
            )
          `,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '12px',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.3s',
          background: useMotionTemplate`
            radial-gradient(
              ${radius * 0.8}px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.3),
              transparent 60%
            )
          `,
          pointerEvents: 'none',
          zIndex: 0,
          mixBlendMode: 'lighten'
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};
