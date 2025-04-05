import Web3 from "web3";

// Initialize web3 with MetaMask provider
let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
} else {
  console.log("Please install MetaMask!");
  // You could use a fallback provider like Infura if needed
  // web3 = new Web3("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
}

// Your contract address
const contractAddress = "0xA6aaE3c93C7783e92db014A84e93edae1c0023E0";
// const contractAddress = "0x8d4f9EcA4A99C2Df58502c1046D90dfFACdfe2Ff";

// const contractAddress = "0xA6aaE3c93C7783e92db014A84e93edae1c0023E0";

// Contract ABI
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsSpent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allocatedAmount",
        type: "uint256",
      },
    ],
    name: "ProjectCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_allocatedAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_projectOwner",
        type: "address",
      },
    ],
    name: "createProject",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getProjects",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "allocatedAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "spentAmount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "projectOwner",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct FundTracker.Project[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "projects",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "allocatedAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "spentAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "projectOwner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_projectId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "spendFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Connect wallet function
export async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Wallet connected");
      return true;
    } catch (error) {
      console.error("User rejected wallet connection:", error);
      return false;
    }
  } else {
    alert("Please install MetaMask!");
    return false;
  }
}

// Get account function
export async function getAccount() {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

// Export web3 and contract instance
export { web3, contract };
