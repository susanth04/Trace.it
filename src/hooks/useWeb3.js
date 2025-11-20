import { useState, useEffect } from 'react';
import { web3, connectWallet, getAccount, checkNetwork, getNetworkName } from '../web3';

export const useWeb3 = () => {
    const [account, setAccount] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [networkName, setNetworkName] = useState("");
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                if (web3) {
                    const accounts = await web3.eth.getAccounts();
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setIsConnected(true);

                        // Check network
                        const networkCheck = await checkNetwork();
                        setIsCorrectNetwork(networkCheck.success);

                        const name = await getNetworkName();
                        setNetworkName(name);
                    }
                }
            } catch (error) {
                console.error("Error checking connection:", error);
                setError(error.message);
            }
            setLoading(false);
        };

        checkConnection();

        if (window.ethereum) {
            // Listen for account changes
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                } else {
                    setAccount("");
                    setIsConnected(false);
                }
            });

            // Listen for network changes
            window.ethereum.on("chainChanged", async () => {
                // Reload the page on network change (recommended by MetaMask)
                window.location.reload();
            });
        }

        // Cleanup
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", () => { });
                window.ethereum.removeListener("chainChanged", () => { });
            }
        };
    }, []);

    const connect = async () => {
        setError(null);
        const result = await connectWallet();

        if (result.success) {
            const account = await getAccount();
            setAccount(account);
            setIsConnected(true);

            // Check network after connection
            const networkCheck = await checkNetwork();
            setIsCorrectNetwork(networkCheck.success);

            const name = await getNetworkName();
            setNetworkName(name);
        } else if (result.error === "MetaMask not installed") {
            setError("Please install MetaMask to use this feature");
            // Premium UX: Open download page instead of alerting
            window.open("https://metamask.io/download/", "_blank");
        } else if (result.needsNetworkSwitch) {
            setError("Please switch to Sepolia testnet in MetaMask");
        } else {
            setError(result.error);
        }
    };

    return {
        account,
        isConnected,
        loading,
        connect,
        error,
        networkName,
        isCorrectNetwork
    };
};
