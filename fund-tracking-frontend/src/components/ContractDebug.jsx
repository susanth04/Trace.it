import React, { useState, useEffect } from 'react';
import { web3 } from '../web3';
import { switchToSepolia } from '../utils/network';

function ContractDebug() {
  const [debugInfo, setDebugInfo] = useState({
    network: 'Loading...',
    contractCode: 'Loading...',
    web3Connected: false,
  });
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const checkDebugInfo = async () => {
      try {
        if (!web3) {
          setDebugInfo((prev) => ({ ...prev, web3Connected: false }));
          return;
        }

        const network = await web3.eth.getChainId();
        const networkName =
          network === 11155111 ? '✅ Sepolia (11155111)' : `❌ Wrong Network (${network})`;

        const contractAddress = '0xA6aaE3c93C7783e92db014A84e93edae1c0023E0';
        const code = await web3.eth.getCode(contractAddress);
        const hasCode = code !== '0x' ? '✅ Contract exists' : '❌ No contract at this address';

        setDebugInfo({
          network: networkName,
          contractCode: hasCode,
          web3Connected: true,
        });
      } catch (error) {
        console.error('Debug error:', error);
      }
    };

    checkDebugInfo();

    // Recheck when network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        checkDebugInfo();
      });
    }
  }, []);

  const handleSwitchNetwork = async () => {
    setSwitching(true);
    const success = await switchToSepolia();
    if (success) {
      // Recheck debug info after switching
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    setSwitching(false);
  };

  return (
    <div
      style={{
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#f8fafc',
      }}
    >
      <div>🔗 Web3 Connected: {debugInfo.web3Connected ? '✅' : '❌'}</div>
      <div>🌐 Network: {debugInfo.network}</div>
      <div>📋 Contract: {debugInfo.contractCode}</div>
      <div>Contract Address: 0xA6aaE3c93C7783e92db014A84e93edae1c0023E0</div>
      
      {debugInfo.network.includes('Wrong') && (
        <button
          onClick={handleSwitchNetwork}
          disabled={switching}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: switching ? 'not-allowed' : 'pointer',
            opacity: switching ? 0.6 : 1,
            fontWeight: 'bold',
            fontSize: '12px',
          }}
        >
          {switching ? '⏳ Switching...' : '🔄 Switch to Sepolia'}
        </button>
      )}
    </div>
  );
}

export default ContractDebug;
