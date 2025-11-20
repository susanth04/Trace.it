/**
 * Switch MetaMask to Sepolia testnet
 */
export async function switchToSepolia() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return false;
  }

  try {
    // Try to switch to Sepolia
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID in hex
    });
    console.log("✅ Switched to Sepolia testnet");
    return true;
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added, add it
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia",
              rpcUrls: [`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`],
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "sepETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        console.log("✅ Added and switched to Sepolia testnet");
        return true;
      } catch (addError) {
        console.error("❌ Error adding Sepolia:", addError);
        return false;
      }
    } else {
      console.error("❌ Error switching to Sepolia:", error);
      return false;
    }
  }
}
