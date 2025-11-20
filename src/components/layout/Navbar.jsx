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
