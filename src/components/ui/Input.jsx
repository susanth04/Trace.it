import React from 'react';

const Input = ({ label, error, ...props }) => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
        marginBottom: 'var(--spacing-md)',
    };

    const labelStyle = {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: 'var(--text-muted)',
    };

    const inputStyle = {
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        color: 'var(--text-main)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'var(--transition)',
        width: '100%',
    };

    return (
        <div style={containerStyle}>
            {label && <label style={labelStyle}>{label}</label>}
            <input
                style={inputStyle}
                className="focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                {...props}
            />
            {error && <span style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</span>}
        </div>
    );
};

export default Input;
