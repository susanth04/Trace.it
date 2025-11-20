import Web3 from "web3";
import { keccak256 } from "web3-utils";

// Initialize web3 with MetaMask provider or fallback
let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  console.log("MetaMask detected and initialized");
} else {
  console.warn("MetaMask not detected - using fallback provider");
  // Fallback to Sepolia testnet via public RPC
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`
    )
  );
}

// Contract configuration
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

// Enhanced ABI for FundTrackerSecure
const abi = [
  // Admin functions
  {
    inputs: [{ internalType: "address", name: "_official", type: "address" }],
    name: "addGovernmentOfficial",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_official", type: "address" }],
    name: "removeGovernmentOfficial",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Project creation with hash
  {
    inputs: [
      { internalType: "bytes32", name: "_dataHash", type: "bytes32" },
      { internalType: "uint256", name: "_allocatedAmount", type: "uint256" },
      { internalType: "address", name: "_projectOwner", type: "address" },
    ],
    name: "createProject",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Spend funds with category and description hash
  {
    inputs: [
      { internalType: "uint256", name: "_projectId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "string", name: "_category", type: "string" },
      { internalType: "bytes32", name: "_descriptionHash", type: "bytes32" },
    ],
    name: "spendFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Set project status
  {
    inputs: [
      { internalType: "uint256", name: "_projectId", type: "uint256" },
      { internalType: "uint8", name: "_newStatus", type: "uint8" },
    ],
    name: "setProjectStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Add approver
  {
    inputs: [
      { internalType: "uint256", name: "_projectId", type: "uint256" },
      { internalType: "address", name: "_approver", type: "address" },
    ],
    name: "addApprover",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // View functions
  {
    inputs: [],
    name: "getProjectCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_projectId", type: "uint256" }],
    name: "getProject",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "dataHash", type: "bytes32" },
          { internalType: "uint256", name: "allocatedAmount", type: "uint256" },
          { internalType: "uint256", name: "spentAmount", type: "uint256" },
          { internalType: "address", name: "projectOwner", type: "address" },
          { internalType: "address[]", name: "approvers", type: "address[]" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
        ],
        internalType: "struct FundTracker.Project",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_projectId", type: "uint256" }],
    name: "getProjectHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_projectId", type: "uint256" }],
    name: "getRemainingFunds",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_projectId", type: "uint256" }],
    name: "getSpendingPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllProjects",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "dataHash", type: "bytes32" },
          { internalType: "uint256", name: "allocatedAmount", type: "uint256" },
          { internalType: "uint256", name: "spentAmount", type: "uint256" },
          { internalType: "address", name: "projectOwner", type: "address" },
          { internalType: "address[]", name: "approvers", type: "address[]" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
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
    inputs: [{ internalType: "uint256", name: "_projectId", type: "uint256" }],
    name: "getProjectSpendingRecords",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "projectId", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "address", name: "spentBy", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "approved", type: "bool" },
          { internalType: "bytes32", name: "descriptionHash", type: "bytes32" },
        ],
        internalType: "struct FundTracker.SpendingRecord[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Create contract instance
const contract = web3 ? new web3.eth.Contract(abi, contractAddress) : null;

// Helper functions for hashing
export function hashProjectData(name, description) {
  const combined = `${name}${description}`;
  return keccak256(combined);
}

export function hashDescription(description) {
  return keccak256(description);
}

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
  if (!web3) return null;
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

// Create project with hashed data
export async function createSecureProject(name, description, allocatedAmount, projectOwner) {
  if (!contract || !web3) {
    throw new Error("Contract not available");
  }

  const dataHash = hashProjectData(name, description);
  const amountInWei = web3.utils.toWei(allocatedAmount.toString(), "ether");

  const account = await getAccount();
  return contract.methods
    .createProject(dataHash, amountInWei, projectOwner)
    .send({ from: account });
}

// Spend funds with category
export async function spendFundsSecure(projectId, amount, category, description) {
  if (!contract || !web3) {
    throw new Error("Contract not available");
  }

  const amountInWei = web3.utils.toWei(amount.toString(), "ether");
  const descriptionHash = hashDescription(description);

  const account = await getAccount();
  return contract.methods
    .spendFunds(projectId, amountInWei, category, descriptionHash)
    .send({ from: account });
}

// Export web3 and contract instance
export { web3, contract };
