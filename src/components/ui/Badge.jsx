import React from 'react';

const Badge = ({ children, variant = 'default' }) => {
    const getStyle = () => {
        const base = {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        };

        switch (variant) {
            case 'success':
                return { ...base, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' };
            case 'warning':
                return { ...base, background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' };
            case 'error':
                return { ...base, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' };
            default:
                return { ...base, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' };
        }
    };

    return (
        <span style={getStyle()}>
            {children}
        </span>
    );
};

export default Badge;
