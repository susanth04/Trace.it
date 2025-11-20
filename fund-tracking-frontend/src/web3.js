import Web3 from "web3";

// Initialize web3 with MetaMask provider
let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  console.log("✅ MetaMask detected");
} else {
  console.warn("⚠️ MetaMask not detected - using fallback provider");
  // Fallback to Sepolia testnet via public RPC
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`
    )
  );
}

// Your contract address (Sepolia testnet)
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "0x22C7E76aE283E7db209B534bA9c310287a4f4068";
console.log("📋 Contract Address:", contractAddress);

// Contract ABI - Updated for FundTrackerSecure
const abi = [
  {
    inputs: [{ internalType: "address", name: "_admin", type: "address" }],
    name: "addAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
        internalType: "bytes32",
        name: "_dataHash",
        type: "bytes32",
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
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_projectId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "string", name: "_category", type: "string" },
      { internalType: "bytes32", name: "_descriptionHash", type: "bytes32" },
      { internalType: "address", name: "_receiver", type: "address" },
    ],
    name: "spendFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
  {
    inputs: [],
    name: "getProjectCount",
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
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
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
    inputs: [],
    name: "getProjectsSimple",
    outputs: [
      {
        internalType: "string[]",
        name: "names",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "descriptions",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "spent",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "owners",
        type: "address[]",
      },
      {
        internalType: "bool[]",
        name: "active",
        type: "bool[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Create contract instance
let contract = null;
try {
  if (web3) {
    contract = new web3.eth.Contract(abi, contractAddress);
    console.log("✅ Contract instance created");
  }
} catch (error) {
  console.error("❌ Error creating contract:", error);
}

// Connect wallet function
export async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return false;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("✅ Wallet connected:", accounts[0]);
    return true;
  } catch (error) {
    console.error("❌ User rejected wallet connection:", error);
    return false;
  }
}

// Get account function
export async function getAccount() {
  try {
    if (!web3) return null;
    const accounts = await web3.eth.getAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("❌ Error getting account:", error);
    return null;
  }
}

// Get all projects with error handling
export async function getProjects() {
  if (!contract) {
    throw new Error("❌ Contract not available. Make sure you're connected to Sepolia testnet.");
  }

  try {
    console.log("📥 Fetching projects from contract...");
    const result = await contract.methods.getProjectsSimple().call();
    
    // Map the arrays back into project objects with IDs
    const projects = result.names.map((name, index) => ({
      id: index,
      name: name,
      description: result.descriptions[index],
      allocatedAmount: result.amounts[index],
      spentAmount: result.spent[index],
      projectOwner: result.owners[index],
      isActive: result.active[index]
    }));
    
    console.log("✅ Projects fetched:", projects.length);
    return projects;
  } catch (error) {
    console.error("❌ Error fetching projects:", error.message);
    throw new Error(
      "Failed to load projects. The contract may not be deployed at this address. Check the console for details."
    );
  }
}

// Export web3 and contract instance
export { web3, contract };
