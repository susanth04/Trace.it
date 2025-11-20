import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { web3, contract, getAccount } from '../web3';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Vortex } from '../components/ui/Vortex';

const CreateProject = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [projectOwner, setProjectOwner] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const setCurrentAccount = async () => {
            const account = await getAccount();
            setProjectOwner(account);
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

            await contract.methods
                .createProject(name, description, dataHash, amountInWei, projectOwner)
                .send({ 
                    from: account,
                    value: amountInWei  // Send the ETH amount
                });

            navigate('/');

        } catch (error) {
            console.error('Error creating project:', error);
            setError('Failed to create project. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={290}
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
                width: '100%', 
                minHeight: '100vh',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                    <div style={{ maxWidth: '800px', width: '100%' }}>
                        <div style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                            <h1>Create New Project</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Initialize a new government project on the blockchain.</p>
                        </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Project Name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. City Infrastructure Upgrade"
                        required
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
                        <label htmlFor="description" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="4"
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

                    <Input
                        label="Budget Amount (ETH)"
                        type="number"
                        id="amount"
                        step="0.001"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />

                    <Input
                        label="Project Manager (Government Wallet)"
                        type="text"
                        id="projectOwner"
                        value={projectOwner}
                        onChange={(e) => setProjectOwner(e.target.value)}
                        placeholder="0x..."
                        required
                        disabled
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: 'var(--spacing-lg)' }}>
                        This is your connected wallet - you will manage and approve fund spending.
                    </p>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: 'var(--error)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="flex-center" style={{ gap: 'var(--spacing-md)' }}>
                        <Button type="button" variant="ghost" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading} style={{ minWidth: '150px' }}>
                            Create Project
                        </Button>
                    </div>
                </form>
            </Card>
            </div>
        </div>
        </Vortex>
    );
};

export default CreateProject;