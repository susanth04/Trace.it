# WhereItWent 💰

A blockchain-based government fund tracking system that ensures transparency and accountability in public fund management. 🏛️

## Overview 🌟

WhereItWent is a decentralized application (DApp) that allows citizens to track how government funds are being utilized in various projects. The platform promotes transparency by recording all transactions on the blockchain and providing real-time access to fund allocation and spending information.

## Features ✨

### For Citizens 👥

- View all government projects and their details
- Track fund allocation and spending in real-time
- Access transparent transaction history
- Monitor project progress and fund utilization
- No wallet connection required for viewing

### For Government Officials 👨‍💼

- Create new projects with detailed descriptions
- Allocate funds to projects
- Track and manage project spending
- Record transactions with full details
- Manage project status and updates

## Technology Stack 🛠️

- **Frontend:**

  - React.js
  - Web3.js
  - CSS3
  - React Router

- **Blockchain:**

  - Ethereum
  - Solidity Smart Contracts
  - Hardhat Development Environment

- **Authentication:**
  - Role-based access control
  - Secure wallet integration

## Smart Contract Features 📝

- Project creation and management
- Fund allocation tracking
- Spending verification
- Transaction history
- Role-based permissions

## Getting Started 🚀

### Prerequisites

- Node.js (v14+ recommended)
- MetaMask wallet
- Git

### Installation 📥

1. Clone the repository

```bash
git clone https://github.com/yourusername/whereitwent.git
cd whereitwent
```

2. Install dependencies for the frontend

```bash
cd fund-tracking-frontend
npm install
```

3. Install dependencies for the smart contract

```bash
cd govt
npm install
```

4. Configure environment variables

```bash
# In the govt folder
cp .env.example .env
# Add your environment variables
```

5. Start the development server

```bash
# In the fund-tracking-frontend folder
npm run dev
```

## Usage 💡

1. **For Citizens:**

   - Visit the website
   - Create an account as a citizen
   - Browse projects and track fund usage
   - View transaction history

2. **For Government Officials:**
   - Register as a government official
   - Connect MetaMask wallet
   - Create and manage projects
   - Record fund allocations and spending

## Project Structure 📁

```
whereitwent/
├── fund-tracking-frontend/    # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── web3.js          # Web3 configuration
│   │   └── App.jsx          # Main application
│   └── public/              # Static files
└── govt/                    # Smart contract files
    ├── contracts/           # Solidity contracts
    ├── scripts/            # Deployment scripts
    └── test/              # Contract tests
```

## Security 🔒

- Role-based access control
- Secure wallet integration
- Smart contract security measures
- Transaction verification

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- OpenZeppelin for smart contract libraries
- Ethereum community
- React community
- All contributors and supporters

⭐️ If you found this project helpful, please give it a star on GitHub!
