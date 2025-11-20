# Government Fund Tracker - Smart Contract Deployment Guide 🚀

This guide will walk you through deploying the `FundTracker` smart contract to the Sepolia Ethereum testnet.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Node.js** (v14 or higher) installed
2. **MetaMask** wallet with some Sepolia test ETH
3. **Alchemy or Infura** account for RPC access
4. **Etherscan** account for contract verification (optional)

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` file and add your credentials:

```env
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-wallet-private-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

#### Getting Your API Keys:

##### a) Alchemy API Key (for Sepolia RPC):
1. Go to [https://www.alchemy.com/](https://www.alchemy.com/)
2. Sign up or log in
3. Create a new app
4. Select **"Ethereum"** as the chain
5. Select **"Sepolia"** as the network
6. Copy the HTTPS URL

##### b) MetaMask Private Key:
1. Open MetaMask
2. Click the three dots (...) on your account
3. Click "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. **⚠️ WARNING**: Never share this key or commit it to Git!

##### c) Etherscan API Key (for verification):
1. Go to [https://etherscan.io/](https://etherscan.io/)
2. Sign up or log in
3. Go to "API Keys" in your profile
4. Create a new API key
5. Copy the key

### Step 3: Get Sepolia Test ETH

You need Sepolia ETH to pay for gas fees. Get free test ETH from these faucets:

1. **Alchemy Sepolia Faucet**: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
2. **Infura Sepolia Faucet**: [https://www.infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)
3. **QuickNode Faucet**: [https://faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)

**Note**: Most faucets require you to have a small amount of ETH on mainnet or connect with social accounts.

### Step 4: Compile the Smart Contract

```bash
npx hardhat compile
```

This will compile `FundTracker.sol` and generate artifacts.

### Step 5: Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

You should see output like:
```
FundTracker deployed to 0xYourContractAddress...
```

**🎉 Save this contract address!** You'll need it for the frontend.

### Step 6: Verify Contract on Etherscan (Optional but Recommended)

After deployment, verify your contract to make it easier for users to interact with:

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

Replace `YOUR_CONTRACT_ADDRESS` with the address from Step 5.

## 🔄 Updating the Frontend

After deploying, update the contract address in the frontend:

1. Open `fund-tracking-frontend/src/web3.js`
2. Find the line: `const contractAddress = "0x..."`
3. Replace with your new deployed contract address
4. Save the file

## 🌐 Network Information

### Sepolia Testnet (Recommended for Testing)
- **Network Name**: Sepolia Test Network
- **Chain ID**: 11155111 (0xaa36a7 in hex)
- **Currency**: SepoliaETH (Test ETH)
- **RPC URL**: `https://sepolia.infura.io/v3/YOUR-API-KEY`
- **Block Explorer**: [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)

### Why Sepolia?
- ✅ Widely supported and stable
- ✅ Free test ETH from faucets
- ✅ Active community
- ✅ Close to mainnet conditions
- ✅ Recommended by Ethereum Foundation

## 🚀 Deploying to Other Networks

### Ethereum Mainnet (Production)

**⚠️ WARNING**: Mainnet uses real ETH. Only deploy when:
- Contract is fully tested on testnet
- Security audit is complete
- You have sufficient ETH for deployment (~$50-200 depending on gas prices)

To deploy to mainnet:

1. Add mainnet configuration to `hardhat.config.js`:
```javascript
mainnet: {
  url: process.env.MAINNET_ALCHEMY_API_URL,
  accounts: [process.env.PRIVATE_KEY],
}
```

2. Deploy:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Alternative Testnets

#### Mumbai (Polygon Testnet) - Lower Fees
```javascript
mumbai: {
  url: "https://rpc-mumbai.maticvigil.com/",
  accounts: [process.env.PRIVATE_KEY],
  chainId: 80001,
}
```

#### Goerli (Being Deprecated - Not Recommended)
Goerli is being phased out. Use Sepolia instead.

## 🧪 Testing Your Contract

Run tests before deployment:

```bash
npx hardhat test
```

## 📚 Useful Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local Hardhat network (for development)
npx hardhat run scripts/deploy.js

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Check Hardhat console
npx hardhat console --network sepolia
```

## 🔒 Security Best Practices

1. **Never commit `.env` file to Git**
   - Add `.env` to `.gitignore`
   - Use `.env.example` as a template

2. **Use a separate wallet for deployment**
   - Don't use your main wallet with large funds
   - Create a dedicated deployment wallet

3. **Test thoroughly**
   - Test on Sepolia before mainnet
   - Consider security audits for production

4. **Keep private keys secure**
   - Never share your private key
   - Consider using hardware wallets for production

## ❓ Troubleshooting

### "Insufficient funds" error
- Make sure you have Sepolia ETH in your wallet
- Get more from faucets listed in Step 3

### "Invalid API key" error
- Double-check your Alchemy/Infura API URL
- Make sure you selected Sepolia network when creating the app

### "Nonce too high" error
- Reset your MetaMask account: Settings > Advanced > Reset Account

### Contract verification fails
- Make sure Etherscan API key is correct
- Wait a few seconds after deployment before verifying

## 📞 Support

For issues or questions:
1. Check [Hardhat Documentation](https://hardhat.org/docs)
2. Visit [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
3. Join [Hardhat Discord](https://discord.gg/hardhat)

## 📝 Contract Details

- **Contract Name**: FundTracker
- **Solidity Version**: 0.8.28
- **Current Deployment**: Sepolia Testnet
- **Contract Address**: Check `fund-tracking-frontend/src/web3.js`

---

⭐️ Remember to update the contract address in your frontend after each deployment!
