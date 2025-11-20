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
