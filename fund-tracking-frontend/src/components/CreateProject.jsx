import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { web3, contract, getAccount } from '../web3';
import { storeProjectMetadata } from '../utils/firebaseHelpers';
import './CreateProject.css';

function CreateProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [projectOwner, setProjectOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get current account on component mount
  React.useEffect(() => {
    const setCurrentAccount = async () => {
      const account = await getAccount();
      setProjectOwner(account); // Set connected wallet as owner (government)
    };
    setCurrentAccount();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !description || !amount) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const account = await getAccount();
      const amountInWei = web3.utils.toWei(amount, 'ether');
      
      // Hash the project data (name + description)
      const combinedData = name + description;
      const dataHash = web3.utils.keccak256(combinedData);
      
      console.log('Data Hash:', dataHash);
      console.log('Amount in Wei:', amountInWei);
      console.log('Project Owner:', projectOwner);
      
      // Create project using the contract and send ETH
      const tx = await contract.methods
        .createProject(name, description, dataHash, amountInWei, projectOwner)
        .send({ 
          from: account,
          value: amountInWei  // Send the ETH amount
        });
      
      // Get the project ID from the transaction logs
      const projectId = tx.events?.ProjectCreated?.returnValues?.projectId;
      
      // Store metadata in Firestore (off-chain storage for additional data)
      if (projectId) {
        await storeProjectMetadata(projectId, {
          name,
          description,
          allocatedAmount: amount,
          projectOwner,
          createdBy: account,
          network: 'sepolia',
        });
        console.log('✅ Project metadata stored in Firestore');
      }
      
      // Redirect to dashboard after successful creation
      navigate('/');
      
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project">
      <h2>Create New Project</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Budget Amount (ETH)</label>
          <input
            type="number"
            id="amount"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="projectOwner">Project Manager (Government Wallet)</label>
          <input
            type="text"
            id="projectOwner"
            value={projectOwner}
            onChange={(e) => setProjectOwner(e.target.value)}
            required
            disabled
          />
          <small>This is your connected wallet - you will manage and approve fund spending</small>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
