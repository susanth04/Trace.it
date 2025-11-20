import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const InteractiveTrendCard = ({
  title,
  subtitle,
  totalValue,
  newValue,
  totalValueLabel = 'Total Amount',
  newValueLabel = 'New Amount',
  chartData,
  className,
  icon,
  // Set default theme-based colors
  defaultBarColor = '#64748b',
  barColor = '#6366f1',
  adjacentBarColor = 'rgba(99, 102, 241, 0.5)',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxValue = useMemo(() => Math.max(...chartData.map((d) => d.value)), [chartData]);

  return (
    <div
      className={cn(
        'w-full rounded-2xl border bg-card p-6 text-card-foreground shadow-sm',
        className
      )}
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        backdropFilter: 'blur(10px)',
        color: 'var(--text-main)',
        maxWidth: '32rem'
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.025em', margin: 0 }}>{title}</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.025em', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>
        </div>
        <button 
          style={{
            borderRadius: '9999px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '0.5rem',
            transition: 'all 0.2s',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)'}
        >
          {icon || <ArrowUpRight size={16} />}
        </button>
      </div>

      {/* Interactive Chart */}
      <div
        style={{
          position: 'relative',
          marginTop: '4rem',
          height: '10rem'
        }}
        onMouseLeave={() => setHoveredIndex(null)}
        role="figure"
        aria-label={`Trend chart showing data for ${chartData.length} periods.`}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                top: '-2rem',
                left: `${(hoveredIndex / (chartData.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
                width: '2.5rem'
              }}
            >
              <div style={{
                borderRadius: '0.375rem',
                backgroundColor: 'var(--text-main)',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--background)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                {chartData[hoveredIndex].value}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bars and Labels */}
        <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.25rem' }}>
          {chartData.map((data, index) => {
            const barHeight = `${(data.value / maxValue) * 100}%`;
            const isHovered = hoveredIndex === index;
            const isAdjacent = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;

            return (
              <div key={index} style={{ display: 'flex', height: '100%', flex: '1', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-end'
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  aria-label={`${data.month}: ${data.value}`}
                  role="img"
                >
                  <motion.div
                    style={{
                      width: '100%',
                      height: barHeight,
                      borderRadius: '0.125rem 0.125rem 0 0'
                    }}
                    initial={{ backgroundColor: defaultBarColor }}
                    animate={{
                      backgroundColor: isHovered
                        ? barColor
                        : isAdjacent
                        ? adjacentBarColor
                        : defaultBarColor,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                </div>
                <span style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Footer Stats */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(99, 102, 241, 0.2)', paddingTop: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{totalValueLabel}</p>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>{totalValue.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{newValueLabel}</p>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>{newValue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTrendCard;
