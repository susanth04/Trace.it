import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { web3, contract, connectWallet, getAccount } from "./web3";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Instructions from "./pages/Instructions";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (web3) {
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
      setLoading(false);
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount("");
          setIsConnected(false);
        }
      });
    }
  }, []);

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      const account = await getAccount();
      setAccount(account);
      setIsConnected(true);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            !isConnected ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <header>
                  <div className="header-content">
                    <h1>trace.it</h1>
                    <nav>
                      <Link to="/">Dashboard</Link>
                      <Link to="/create">Create Project</Link>
                    </nav>
                    <div className="wallet-info">
                      <a 
                        href="https://github.com/susanth04/Trace.it" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '1rem',
                          color: '#a78bfa',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#fff'}
                        onMouseLeave={(e) => e.target.style.color = '#a78bfa'}
                      >
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          style={{ marginRight: '0.5rem' }}
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                      <div>
                        <span>
                          Connected: {account.substring(0, 6)}...
                          {account.substring(account.length - 4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </header>

                <main>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/instructions" element={<Instructions />} />
                    <Route path="/create" element={<CreateProject />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                  </Routes>
                </main>

                <footer>
                  <p>Blockchain-Based Government Fund Tracking System</p>
                </footer>
              </>
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
