import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { web3, contract, getAccount } from "../web3";
import { storeSpendingDetails } from "../utils/firebaseHelpers";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spendAmount, setSpendAmount] = useState("");
  const [spendDescription, setSpendDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [receiver, setReceiver] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projects = await contract.methods.getAllProjects().call();

        if (id >= projects.length) {
          setError("Project not found");
          setLoading(false);
          return;
        }

        // Get the project at the specified index
        const projectData = projects[id];

        // Format project data
        const formattedProject = {
          id: parseInt(id),
          name: projectData.name,
          description: projectData.description,
          allocatedAmount: web3.utils.fromWei(
            projectData.allocatedAmount,
            "ether"
          ),
          spentAmount: web3.utils.fromWei(projectData.spentAmount, "ether"),
          projectOwner: projectData.projectOwner,
          isActive: projectData.isActive,
        };

        setProject(formattedProject);

        // Check if current user is the project owner
        const account = await getAccount();
        setIsOwner(
          account && account.toLowerCase() === projectData.projectOwner.toLowerCase()
        );
        setReceiver(account || ""); // Default receiver to current account
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleSpendFunds = async (e) => {
    e.preventDefault();

    if (!spendAmount || !spendDescription || !receiver) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const account = await getAccount();
      const amountInWei = web3.utils.toWei(spendAmount, "ether");
      
      // Hash the spending description for privacy
      const descriptionHash = web3.utils.keccak256(spendDescription);

      // Spend funds using the contract with correct parameters
      const tx = await contract.methods
        .spendFunds(id, amountInWei, category, descriptionHash, receiver)
        .send({ from: account });

      // Store full spending details in Firestore (off-chain)
      await storeSpendingDetails(id, {
        amount: spendAmount,
        amountWei: amountInWei,
        category,
        description: spendDescription, // Store full description off-chain
        descriptionHash, // Store hash for verification
        receiver,
        spentBy: account,
        transactionHash: tx.transactionHash,
      });
      console.log('✅ Spending details stored in Firestore');

      // Refresh project data
      const updatedProjects = await contract.methods.getAllProjects().call();
      const updatedProject = updatedProjects[id];

      setProject({
        ...project,
        spentAmount: web3.utils.fromWei(updatedProject.spentAmount, "ether"),
      });

      // Reset form
      setSpendAmount("");
      setSpendDescription("");

      alert("Funds spent successfully!");
    } catch (error) {
      console.error("Error spending funds:", error);
      alert("Failed to spend funds. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  const remaining = (
    parseFloat(project.allocatedAmount) - parseFloat(project.spentAmount)
  ).toFixed(4);
  const percentSpent =
    (parseFloat(project.spentAmount) / parseFloat(project.allocatedAmount)) *
      100 || 0;

  return (
    <div className="project-details">
      <h2>{project.name}</h2>

      <div className="project-info">
        <div className="info-item">
          <span className="label">Description:</span>
          <p>{project.description}</p>
        </div>

        <div className="info-item">
          <span className="label">Project Owner:</span>
          <p className="address">{project.projectOwner}</p>
        </div>

        <div className="info-item">
          <span className="label">Status:</span>
          <span
            className={`status ${project.isActive ? "active" : "inactive"}`}
          >
            {project.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="fund-status">
        <h3>Fund Status</h3>

        <div className="fund-grid">
          <div className="fund-box allocated">
            <span className="amount">{project.allocatedAmount} ETH</span>
            <span className="label">Total Allocated</span>
          </div>

          <div className="fund-box spent">
            <span className="amount">{project.spentAmount} ETH</span>
            <span className="label">Total Spent</span>
          </div>

          <div className="fund-box remaining">
            <span className="amount">{remaining} ETH</span>
            <span className="label">Remaining</span>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            ></div>
          </div>
          <div className="progress-labels">
            <span>0%</span>
            <span>{percentSpent.toFixed(1)}% spent</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {!isOwner && project.isActive && (
        <div className="spend-funds-section" style={{ 
          background: 'rgba(245, 158, 11, 0.1)', 
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>⚠️ Access Restricted</h3>
          <p style={{ marginBottom: '0.5rem' }}>
            Only the project owner can spend funds from this project.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Project Owner: <code style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.8rem'
            }}>{project.projectOwner}</code>
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Switch to this wallet in MetaMask to spend funds.
          </p>
        </div>
      )}

      {isOwner && project.isActive && (
        <div className="spend-funds-section">
          <h3>Spend Funds</h3>

          <form onSubmit={handleSpendFunds}>
            <div className="form-group">
              <label htmlFor="spendAmount">Amount (ETH)</label>
              <input
                type="number"
                id="spendAmount"
                step="0.001"
                min="0"
                max={remaining}
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="spendDescription">Description</label>
              <textarea
                id="spendDescription"
                value={spendDescription}
                onChange={(e) => setSpendDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Personnel">Personnel</option>
                <option value="Materials">Materials</option>
                <option value="Equipment">Equipment</option>
              </select>
              <small>Category for this spending transaction</small>
            </div>

            <div className="form-group">
              <label htmlFor="receiver">Receiver Address</label>
              <input
                type="text"
                id="receiver"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                required
                placeholder="0x..."
              />
              <small>Address that will receive the ETH payment</small>
            </div>

            <button type="submit" disabled={loading} className="spend-button">
              {loading ? "Processing..." : "Spend Funds"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
