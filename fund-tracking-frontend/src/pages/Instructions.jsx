import React from 'react';
import { Link } from 'react-router-dom';
import { Vortex } from '../components/ui/Vortex';
import Button from '../components/ui/Button';

const Instructions = () => {
    return (
        <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={270}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'auto'
            }}
        >
            <div style={{
                width: '100%',
                minHeight: '100vh',
                padding: '2rem',
                maxWidth: '900px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'linear-gradient(180deg, rgba(18, 18, 30, 0.85) 0%, rgba(32, 22, 62, 0.85) 50%, rgba(24, 14, 54, 0.85) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(120, 80, 255, 0.25)',
                    borderRadius: '22px',
                    padding: '3rem',
                    width: '100%'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem'
                        }}>
                            Welcome to trace.it
                        </h1>
                        <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '1.1rem' }}>
                            Blockchain-powered government fund tracking
                        </p>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
                            border: '1px solid rgba(120, 80, 255, 0.2)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{
                                color: '#a78bfa',
                                fontSize: '1.25rem',
                                marginBottom: '1rem',
                                fontWeight: '700'
                            }}>
                                🚀 Getting Started
                            </h3>
                            <ol style={{
                                color: 'rgba(148, 163, 184, 0.9)',
                                lineHeight: '1.8',
                                paddingLeft: '1.5rem',
                                fontSize: '1rem'
                            }}>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <strong style={{ color: '#fff' }}>Connect MetaMask:</strong> Ensure you're on Sepolia testnet
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <strong style={{ color: '#fff' }}>Create Projects:</strong> Initialize new government fund tracking projects
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <strong style={{ color: '#fff' }}>Allocate Funds:</strong> Send ETH to project addresses on the blockchain
                                </li>
                                <li>
                                    <strong style={{ color: '#fff' }}>Track Spending:</strong> Record and verify all fund expenditures transparently
                                </li>
                            </ol>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(239, 68, 68, 0.05) 100%)',
                            border: '1px solid rgba(236, 72, 153, 0.2)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{
                                color: '#ec4899',
                                fontSize: '1.25rem',
                                marginBottom: '1rem',
                                fontWeight: '700'
                            }}>
                                ⚡ Key Features
                            </h3>
                            <ul style={{
                                color: 'rgba(148, 163, 184, 0.9)',
                                lineHeight: '1.8',
                                paddingLeft: '1.5rem',
                                fontSize: '1rem',
                                listStyle: 'none'
                            }}>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#22c55e', marginRight: '0.5rem' }}>✓</span>
                                    Immutable blockchain records
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#22c55e', marginRight: '0.5rem' }}>✓</span>
                                    Real-time fund tracking
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#22c55e', marginRight: '0.5rem' }}>✓</span>
                                    Transparent spending audit trail
                                </li>
                                <li>
                                    <span style={{ color: '#22c55e', marginRight: '0.5rem' }}>✓</span>
                                    Secure wallet authentication
                                </li>
                            </ul>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '16px',
                            padding: '1.5rem'
                        }}>
                            <h3 style={{
                                color: '#22c55e',
                                fontSize: '1.25rem',
                                marginBottom: '1rem',
                                fontWeight: '700'
                            }}>
                                💡 Smart Contract
                            </h3>
                            <p style={{
                                color: 'rgba(148, 163, 184, 0.9)',
                                lineHeight: '1.8',
                                fontSize: '1rem',
                                marginBottom: '0.75rem'
                            }}>
                                Deployed on <strong style={{ color: '#fff' }}>Sepolia Testnet</strong>
                            </p>
                            <p style={{
                                color: '#a78bfa',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                background: 'rgba(0, 0, 0, 0.3)',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                wordBreak: 'break-all'
                            }}>
                                0x48F2825CB290F54DAD34f7c26869518c8C3B875C
                            </p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                padding: '1rem 2.5rem',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                borderRadius: '16px',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.35)',
                                transition: 'all 0.3s ease'
                            }}>
                                Go to Dashboard →
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Vortex>
    );
};

export default Instructions;
