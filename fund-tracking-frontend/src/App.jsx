import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { web3, contract, connectWallet, getAccount } from "./web3";
import Dashboard from "./components/Dashboard";
import CreateProject from "./components/CreateProject";
import ProjectDetails from "./components/ProjectDetails";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
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
        <header>
          <div className="header-content">
            <h1>WhereItWent</h1>
            <nav>
              <Link to="/">Dashboard</Link>
              <Link to="/create">Create Project</Link>
            </nav>
            <div className="wallet-info">
              {isConnected ? (
                <div>
                  <span>
                    Connected: {account.substring(0, 6)}...
                    {account.substring(account.length - 4)}
                  </span>
                </div>
              ) : (
                <button onClick={handleConnect}>Connect Wallet</button>
              )}
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>
        </main>

        <footer>
          <p>Blockchain-Based Government Fund Tracking System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
