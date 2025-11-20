# 🔒 WhereItWent - Security & Hashing Implementation

## ⚠️ CRITICAL: Exposed Credentials

Your Firebase credentials were exposed publicly. **Immediately follow these steps:**

### Step 1: Revoke Exposed Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `web3-a4fc5` project
3. Go to Project Settings → Service Accounts
4. Regenerate all API keys
5. Update the `.env` file with new credentials

### Step 2: Setup Environment Variables

#### Frontend Setup
```bash
cd fund-tracking-frontend

# Copy the example file
cp .env.example .env

# Edit .env and add your Firebase credentials:
VITE_FIREBASE_API_KEY=your_new_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_CONTRACT_ADDRESS=0xA6aaE3c93C7783e92db014A84e93edae1c0023E0
VITE_NETWORK=sepolia
VITE_INFURA_KEY=9aa3d95b3bc440fa88ea12eaa4456161
```

#### Backend Setup
```bash
cd govt

# Create .env file for smart contract deployment
cat > .env << EOF
ALCHEMY_API_URL=your_alchemy_url_here
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_key_here
EOF
```

## 🔐 Data Privacy: Hashing Strategy

### Project Data Hashing
Projects are now stored with **hashed sensitive data** on-chain:

```solidity
// Smart Contract stores only the hash
bytes32 dataHash = keccak256(abi.encodePacked(projectName + projectDescription))

// Frontend stores the actual data in Firestore (encrypted)
// Smart contract references it by hash for verification
```

### Benefits
- ✅ Sensitive project details NOT exposed on blockchain
- ✅ Public can verify data hasn't been tampered with
- ✅ Only project owners can decode actual project info
- ✅ Complete audit trail of spending

### How It Works

1. **Data Upload Flow**
   ```
   User Input → Encrypt → Hash → Store Hash on-chain
                                 → Store Encrypted Data in Firebase
   ```

2. **Data Retrieval Flow**
   ```
   Get Hash from Contract → Fetch Encrypted Data from Firebase
                         → Decrypt (if authorized)
                         → Verify Hash matches
   ```

## 📋 Smart Contract Updates

### FundTrackerSecure.sol Features

#### 1. **Project Status Management**
```solidity
enum ProjectStatus {
    Draft,          // Initial state
    Active,         // Project active
    Paused,         // Temporarily paused
    Completed,      // Project finished
    Cancelled       // Project cancelled
}
```

#### 2. **Multi-Approver System**
```solidity
// Project owners can add approvers for spending verification
addApprover(projectId, approverAddress)
removeApprover(projectId, approverAddress)
```

#### 3. **Categorized Spending**
```solidity
// Track what funds are spent on
spendFunds(projectId, amount, category, descriptionHash)

// Categories example:
// - "Infrastructure"
// - "Personnel"
// - "Materials"
// - "Services"
```

#### 4. **Admin Role System**
```solidity
// Only government officials can create projects
// Only admins can manage official access
addGovernmentOfficial(address)
removeGovernmentOfficial(address)
```

## 📦 Installation & Deployment

### 1. Install Dependencies
```bash
# Frontend
cd fund-tracking-frontend
npm install web3-utils  # For hashing utilities

# Backend
cd govt
npm install
```

### 2. Deploy New Smart Contract
```bash
cd govt

# Compile the contract
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Update Frontend
```bash
# Update .env with new contract address
VITE_CONTRACT_ADDRESS=<newly_deployed_address>

# Start dev server
npm run dev
```

## 🔄 Migration: Old Contract → New Contract

If you want to migrate from old `FundTracker.sol` to `FundTrackerSecure.sol`:

```bash
# 1. Deploy new contract
npx hardhat run scripts/deploySecure.js --network sepolia

# 2. Get new address and update .env

# 3. Optionally migrate data (if needed)
npx hardhat run scripts/migrateData.js --network sepolia
```

## 🧪 Testing

### Test Hashing Functions
```javascript
// In browser console or test file
import { hashProjectData, hashDescription } from './src/utils/crypto.js'

const projectHash = hashProjectData("School Building", "Construct new school")
console.log(projectHash) // 0x... (bytes32 hash)
```

### Test Web3 Integration
```javascript
import { createSecureProject, spendFundsSecure } from './src/web3Secure.js'

// Create hashed project
await createSecureProject(
  "Hospital Expansion",
  "Expand hospital facilities",
  100, // ETH
  "0x..." // owner address
)

// Spend funds with category
await spendFundsSecure(
  0, // project ID
  10, // ETH amount
  "Construction", // category
  "Materials purchase for Phase 1" // description
)
```

## 🚀 API Reference

### Frontend Utilities

#### `hashProjectData(name, description): bytes32`
Hashes project metadata for on-chain storage

#### `hashDescription(description): bytes32`
Hashes spending descriptions for transparency

#### `createSecureProject(name, desc, amount, owner)`
Creates project with hashed data

#### `spendFundsSecure(projectId, amount, category, description)`
Records spending with category

### Smart Contract Functions

#### Admin Functions
- `addGovernmentOfficial(address)` - Grant official status
- `removeGovernmentOfficial(address)` - Revoke official status
- `addAdmin(address)` - Add admin (admins can manage officials)

#### Project Functions
- `createProject(dataHash, amount, owner)` - Create hashed project
- `setProjectStatus(projectId, status)` - Change project status
- `addApprover(projectId, approver)` - Add approver for spending
- `spendFunds(projectId, amount, category, descriptionHash)` - Record spending

#### View Functions
- `getProject(projectId)` - Get project details (hash visible, not actual data)
- `getProjectHash(projectId)` - Get project data hash
- `getRemainingFunds(projectId)` - Get available funds
- `getSpendingPercentage(projectId)` - Get spending %
- `getProjectSpendingRecords(projectId)` - Get all spending records

## 🛡️ Security Checklist

- [ ] Regenerated Firebase API keys
- [ ] Added `.env` file to `.gitignore`
- [ ] Updated `VITE_` environment variables
- [ ] Deployed new smart contract
- [ ] Updated contract address in `.env`
- [ ] Tested hashing functions
- [ ] Verified Firestore encryption rules
- [ ] Tested MetaMask connection on Sepolia

## 📚 Additional Resources

- [Solidity Hash Functions](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#mathematical-and-cryptographic-functions)
- [Web3.js Utils](https://docs.web3js.org/api/web3-utils)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [MetaMask Documentation](https://docs.metamask.io/)

## ⚠️ Important Notes

1. **Never commit `.env` files** - Always use `.env.example` for templates
2. **Test on Sepolia** before mainnet
3. **Keep private keys safe** - Never share PRIVATE_KEY
4. **Verify hashes** - Always verify data matches its hash
5. **Use HTTPS only** - Never expose credentials over HTTP

---

**Last Updated:** November 2025
**Version:** 1.0.0-secure
