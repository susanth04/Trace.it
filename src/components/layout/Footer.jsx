import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '2rem 0',
            marginTop: 'auto',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
        }}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} trace.it. Blockchain-Based Government Fund Tracking System.</p>
            </div>
        </footer>
    );
};

export default Footer;
