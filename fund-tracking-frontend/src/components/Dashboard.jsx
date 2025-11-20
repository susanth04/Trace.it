import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { web3, contract, getProjects } from '../web3';
import { generateMockProjects } from '../mockData';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ContractDebug from './ContractDebug';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        setUseMockData(false);

        if (!contract || !web3) {
          console.log('📌 Using mock data - contract not available');
          setUseMockData(true);
          const mockData = generateMockProjects();
          setProjects(mockData);
          setLoading(false);
          return;
        }

        console.log("📥 Dashboard: Fetching projects from blockchain...");
        const projectsData = await getProjects();
        
        // Format projects data
        const formattedProjects = projectsData.map((project, index) => ({
          id: index,
          name: project.name,
          description: project.description,
          allocatedAmount: web3.utils.fromWei(project.allocatedAmount, 'ether'),
          spentAmount: web3.utils.fromWei(project.spentAmount, 'ether'),
          projectOwner: project.projectOwner,
          isActive: project.isActive
        }));
        
        console.log("✅ Dashboard: Projects loaded from blockchain:", formattedProjects.length);
        setProjects(formattedProjects);
      } catch (error) {
        console.warn('⚠️ Failed to load from blockchain, using mock data:', error.message);
        setUseMockData(true);
        const mockData = generateMockProjects();
        setProjects(mockData);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: projects.map(project => project.name),
    datasets: [
      {
        label: 'Allocated Funds (ETH)',
        data: projects.map(project => parseFloat(project.allocatedAmount)),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Spent Funds (ETH)',
        data: projects.map(project => parseFloat(project.spentAmount)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return (
      <div>
        <ContractDebug />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {useMockData && (
        <div
          style={{
            background: 'rgba(248, 113, 113, 0.15)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#fca5a5',
            fontSize: '14px',
          }}
        >
          📌 <strong>Demo Mode:</strong> Showing sample data. To use real blockchain data, switch MetaMask to Sepolia testnet and deploy the contract.
        </div>
      )}
      <h2>Projects Overview</h2>
      
      {projects.length > 0 ? (
        <>
          <div className="chart-container">
            <h3>Fund Allocation and Spending</h3>
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount (ETH)'
                    }
                  }
                }
              }} 
            />
          </div>
          
          <div className="projects-list">
            <h3>All Projects</h3>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div key={index} className="project-card">
                  <h4>{project.name}</h4>
                  <p className="description">{project.description}</p>
                  <div className="project-stats">
                    <div className="stat">
                      <span className="label">Allocated:</span>
                      <span className="value">{project.allocatedAmount} ETH</span>
                    </div>
                    <div className="stat">
                      <span className="label">Spent:</span>
                      <span className="value">{project.spentAmount} ETH</span>
                    </div>
                    <div className="stat">
                      <span className="label">Remaining:</span>
                      <span className="value">{(parseFloat(project.allocatedAmount) - parseFloat(project.spentAmount)).toFixed(4)} ETH</span>
                    </div>
                  </div>
                  <div className="project-status">
                    <span className={project.isActive ? "active" : "inactive"}>
                      {project.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Link to={`/project/${project.id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="no-projects">
          <p>No projects found. Create a new project to get started.</p>
          <Link to="/create" className="create-button">Create Project</Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
