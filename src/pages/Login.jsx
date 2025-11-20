import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWallet, getAccount } from '../web3';
import { auth, db } from '../firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Vortex } from '../components/ui/Vortex';

const Login = () => {
    const [account, setAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already connected
        const checkConnection = async () => {
            const acc = await getAccount();
            if (acc) {
                setAccount(acc);
                // Redirect to instructions page if already connected
                setTimeout(() => navigate('/instructions'), 1500);
            }
        };
        checkConnection();
    }, [navigate]);

    const handleConnect = async () => {
        setLoading(true);
        setError('');

        try {
            // First connect MetaMask wallet
            const success = await connectWallet();
            if (!success) {
                setError('Failed to connect wallet. Please try again.');
                setLoading(false);
                return;
            }

            const walletAddress = await getAccount();
            setAccount(walletAddress);

            // Sign in to Firebase anonymously (or you can use custom auth)
            const userCredential = await signInAnonymously(auth);
            const user = userCredential.user;

            // Store user profile in Firestore
            const userDocRef = doc(db, 'users', walletAddress.toLowerCase());
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // Create new user profile
                await setDoc(userDocRef, {
                    walletAddress: walletAddress.toLowerCase(),
                    firebaseUid: user.uid,
                    role: 'government_official', // Default role
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                });
                console.log('✅ New user profile created');
            } else {
                // Update last login
                await setDoc(userDocRef, {
                    lastLogin: new Date().toISOString(),
                    firebaseUid: user.uid,
                }, { merge: true });
                console.log('✅ User login updated');
            }

            setTimeout(() => navigate('/instructions'), 1000);
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please make sure MetaMask is installed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={230}
            containerClassName=""
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                    width: '100%',
                    height: '100%'
                }}>
                <Card style={{ 
                    maxWidth: '500px', 
                    width: '100%',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, rgba(18, 18, 30, 0.85) 0%, rgba(32, 22, 62, 0.85) 50%, rgba(24, 14, 54, 0.85) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(120, 80, 255, 0.25)',
                    borderRadius: '22px',
                    boxShadow: 'none',
                    padding: '3rem',
                    transition: 'all 0.35s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(160, 90, 255, 0.25), 0 0 40px rgba(70, 120, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(160, 90, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(120, 80, 255, 0.25)';
                }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ 
                        fontSize: '3rem', 
                        marginBottom: '0.75rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        trace.it
                    </h1>
                    <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '1.05rem', fontWeight: '400' }}>
                        Blockchain-Based Government Fund Tracking
                    </p>
                </div>

                {!account ? (
                    <>
                        <div style={{ 
                            marginBottom: '2rem',
                            padding: '2.5rem',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
                            borderRadius: '20px',
                            border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                margin: '0 auto 1.5rem',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
                                border: '2px solid rgba(99, 102, 241, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg 
                                    style={{ width: '40px', height: '40px', color: '#a78bfa' }}
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>Connect Your Wallet</h3>
                            <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '1rem', lineHeight: '1.6' }}>
                                Connect with MetaMask to access government fund tracking
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                padding: '1.25rem',
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.08) 100%)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                borderRadius: '16px',
                                color: '#fca5a5',
                                marginBottom: '1.5rem',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                            }}>
                                {error}
                            </div>
                        )}

                        <Button 
                            onClick={handleConnect} 
                            isLoading={loading}
                            style={{ 
                                width: '100%', 
                                fontSize: '1.125rem', 
                                padding: '1.125rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: '600',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.35)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🦊 Connect MetaMask
                        </Button>

                        <div style={{ 
                            marginTop: '2.5rem',
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%)',
                            borderRadius: '16px',
                            fontSize: '0.9rem',
                            color: 'rgba(148, 163, 184, 0.9)',
                            border: '1px solid rgba(99, 102, 241, 0.1)',
                            textAlign: 'left'
                        }}>
                            <p style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: '#22c55e', marginRight: '0.5rem', fontSize: '1.25rem' }}>✓</span>
                                <span>Secure wallet authentication</span>
                            </p>
                            <p style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: '#22c55e', marginRight: '0.5rem', fontSize: '1.25rem' }}>✓</span>
                                <span>Track government fund allocation</span>
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: '#22c55e', marginRight: '0.5rem', fontSize: '1.25rem' }}>✓</span>
                                <span>Transparent spending records on blockchain</span>
                            </p>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto 1.5rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}>
                            ✓
                        </div>
                        <h3 style={{ 
                            marginBottom: '1rem', 
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Connected Successfully!
                        </h3>
                        <div style={{
                            padding: '1rem 1.5rem',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                            borderRadius: '12px',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            marginBottom: '1rem'
                        }}>
                            <p style={{ 
                                color: '#a78bfa', 
                                fontSize: '1rem',
                                fontWeight: '600',
                                fontFamily: 'monospace'
                            }}>
                                {account.substring(0, 6)}...{account.substring(account.length - 4)}
                            </p>
                        </div>
                        <p style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '0.95rem' }}>
                            Redirecting to dashboard...
                        </p>
                    </div>
                )}
            </Card>
            </div>
        </Vortex>
    );
};

export default Login;
