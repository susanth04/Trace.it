# trace.it - Blockchain Fund Tracking

Blockchain-powered government fund tracking system built on Ethereum Sepolia testnet.

## 🚀 Features

- **Blockchain Transparency**: All transactions recorded on Ethereum
- **Real-time Tracking**: Monitor fund allocation and spending
- **MetaMask Integration**: Secure wallet authentication
- **Firebase Backend**: User management and data persistence
- **Modern UI**: Responsive design with animated backgrounds

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity + Hardhat
- **Backend**: Firebase (Auth + Firestore)
- **Web3**: ethers.js + MetaMask
- **Charts**: Recharts
- **Styling**: Custom CSS + Framer Motion

## 📦 Deployment on Vercel

### Environment Variables

Set these in your Vercel project settings:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_CONTRACT_ADDRESS=0x48F2825CB290F54DAD34f7c26869518c8C3B875C
VITE_NETWORK=sepolia
VITE_INFURA_KEY=9aa3d95b3bc440fa88ea12eaa4456161
```

### Deploy Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/susanth04/Trace.it.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Deploy!

## 🔧 Local Development

1. **Install dependencies**:
   ```bash
   cd fund-tracking-frontend
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   ```
   http://localhost:5173
   ```

## 📝 Smart Contract

- **Network**: Sepolia Testnet
- **Address**: `0x48F2825CB290F54DAD34f7c26869518c8C3B875C`
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x48F2825CB290F54DAD34f7c26869518c8C3B875C)

## 🎯 Usage

1. Connect MetaMask (Sepolia testnet)
2. View instructions page
3. Create new projects
4. Allocate funds (send ETH)
5. Track spending transparently
6. View real-time analytics

## 🔐 Security

- Environment variables are gitignored
- Firebase keys are secured
- Smart contract is audited and deployed
- MetaMask provides secure wallet connection

## 📄 License

MIT License - feel free to use for your projects!

## 👨‍💻 Developer

Built by susanth04
