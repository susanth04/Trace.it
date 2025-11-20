import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { web3, contract, getAccount } from '../web3';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { Vortex } from '../components/ui/Vortex';

const ProjectDetails = () => {
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

                const projectData = projects[id];

                const formattedProject = {
                    id: parseInt(id),
                    name: projectData.name,
                    description: projectData.description,
                    allocatedAmount: web3.utils.fromWei(projectData.allocatedAmount, "ether"),
                    spentAmount: web3.utils.fromWei(projectData.spentAmount, "ether"),
                    projectOwner: projectData.projectOwner,
                    isActive: projectData.isActive,
                };

                setProject(formattedProject);

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

            await contract.methods
                .spendFunds(id, amountInWei, category, descriptionHash, receiver)
                .send({ from: account });

            const updatedProjects = await contract.methods.getAllProjects().call();
            const updatedProject = updatedProjects[id];

            setProject({
                ...project,
                spentAmount: web3.utils.fromWei(updatedProject.spentAmount, "ether"),
            });

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
        return (
            <div className="flex-center" style={{ minHeight: '50vh' }}>
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-center" style={{ minHeight: '50vh' }}>
                <Card className="text-center">
                    <h3 style={{ color: 'var(--error)' }}>Error</h3>
                    <p>{error}</p>
                    <Link to="/">
                        <Button variant="outline" style={{ marginTop: '1rem' }}>Back to Dashboard</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (!project) return null;

    const remaining = (parseFloat(project.allocatedAmount) - parseFloat(project.spentAmount)).toFixed(4);
    const percentSpent = (parseFloat(project.spentAmount) / parseFloat(project.allocatedAmount)) * 100 || 0;

    return (
        <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={270}
            containerClassName=""
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'auto'
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem',
                width: '100%',
                minHeight: '100vh'
            }}>
        <div className="project-details-page">
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    &larr; Back to Dashboard
                </Link>
                <div className="flex-between">
                    <h1>{project.name}</h1>
                    <Badge variant={project.isActive ? 'success' : 'default'}>
                        {project.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            </div>

            <div className="grid-responsive" style={{ alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    <Card>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>About Project</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-lg)', whiteSpace: 'pre-wrap' }}>
                            {project.description}
                        </p>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--spacing-md)' }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                Project Owner
                            </span>
                            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                                {project.projectOwner}
                            </code>
                        </div>
                    </Card>

                    <Card>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Fund Status</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                            <div className="text-center">
                                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '700' }}>{project.allocatedAmount}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allocated</span>
                            </div>
                            <div className="text-center">
                                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '700', color: 'var(--secondary)' }}>{project.spentAmount}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spent</span>
                            </div>
                            <div className="text-center">
                                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '700', color: 'var(--success)' }}>{remaining}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remaining</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <div className="flex-between" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <span>Utilization</span>
                                <span>{percentSpent.toFixed(1)}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.min(percentSpent, 100)}%`,
                                    height: '100%',
                                    background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                                    transition: 'width 0.5s ease-out'
                                }}></div>
                            </div>
                        </div>
                    </Card>
                </div>

                {!isOwner && project.isActive && (
                    <Card style={{ 
                        background: 'rgba(245, 158, 11, 0.1)', 
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                        <h3 style={{ color: '#f59e0b', marginBottom: 'var(--spacing-md)' }}>
                            ⚠️ Access Restricted
                        </h3>
                        <p style={{ marginBottom: 'var(--spacing-sm)' }}>
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
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-sm)' }}>
                            Switch to this wallet in MetaMask to spend funds.
                        </p>
                    </Card>
                )}

                {isOwner && project.isActive && (
                    <Card>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Spend Funds</h3>
                        <form onSubmit={handleSpendFunds}>
                            <Input
                                label="Amount (ETH)"
                                type="number"
                                step="0.001"
                                min="0"
                                max={remaining}
                                value={spendAmount}
                                onChange={(e) => setSpendAmount(e.target.value)}
                                required
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                                    Description
                                </label>
                                <textarea
                                    value={spendDescription}
                                    onChange={(e) => setSpendDescription(e.target.value)}
                                    required
                                    rows="3"
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.5)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0.75rem 1rem',
                                        color: 'var(--text-main)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'var(--transition)',
                                        width: '100%',
                                        resize: 'vertical'
                                    }}
                                    className="focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.5)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0.75rem 1rem',
                                        color: 'var(--text-main)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'var(--transition)',
                                        width: '100%'
                                    }}
                                    className="focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="General">General</option>
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="Personnel">Personnel</option>
                                    <option value="Materials">Materials</option>
                                    <option value="Equipment">Equipment</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                                    Receiver Address
                                </label>
                                <input
                                    type="text"
                                    value={receiver}
                                    onChange={(e) => setReceiver(e.target.value)}
                                    required
                                    placeholder="0x..."
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.5)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0.75rem 1rem',
                                        color: 'var(--text-main)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'var(--transition)',
                                        width: '100%'
                                    }}
                                    className="focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Address that will receive the ETH payment</small>
                            </div>

                            <Button type="submit" isLoading={loading} variant="secondary" style={{ width: '100%' }}>
                                Spend Funds
                            </Button>
                        </form>
                    </Card>
                )}
            </div>
        </div>
        </div>
        </Vortex>
    );
};

export default ProjectDetails;
