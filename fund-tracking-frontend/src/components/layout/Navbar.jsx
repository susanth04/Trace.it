import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';

const Navbar = ({ account, isConnected, onConnect }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        color: isActive(path) ? 'var(--primary)' : 'var(--text-muted)',
        fontWeight: isActive(path) ? '600' : '400',
        marginRight: 'var(--spacing-lg)',
        transition: 'var(--transition)',
    });

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1rem 0'
        }}>
            <div className="container flex-between">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.025em' }}>
                    <span className="text-gradient">trace.it</span>
                </Link>

                <div className="flex-center">
                    <Link to="/" style={navLinkStyle('/')}>Dashboard</Link>
                    <Link to="/create" style={navLinkStyle('/create')}>Create Project</Link>

                    <a 
                        href="https://github.com/susanth04/Fraud-detetection" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--text-muted)',
                            marginRight: 'var(--spacing-lg)',
                            transition: 'var(--transition)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                        >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>

                    {isConnected ? (
                        <Button variant="outline" size="sm" style={{ marginLeft: 'var(--spacing-md)' }}>
                            {account.substring(0, 6)}...{account.substring(account.length - 4)}
                        </Button>
                    ) : (
                        <Button onClick={onConnect} size="sm" style={{ marginLeft: 'var(--spacing-md)' }}>
                            Connect Wallet
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
