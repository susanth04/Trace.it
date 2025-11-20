import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useWeb3 } from '../../hooks/useWeb3';

const Layout = ({ children }) => {
    const { account, isConnected, connect } = useWeb3();

    return (
        <div className="app-container">
            <Navbar account={account} isConnected={isConnected} onConnect={connect} />
            <main>
                <div className="container">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
