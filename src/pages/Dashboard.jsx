import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { web3, contract } from '../web3';
import { PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Vortex } from '../components/ui/Vortex';
import { Card as ChartCard, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card-shadcn';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '../components/ui/pie-chart';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                if (!contract || !web3) {
                    setError('Smart contract not available. Please ensure MetaMask is connected to Sepolia testnet.');
                    setLoading(false);
                    return;
                }

                const projectsData = await contract.methods.getAllProjects().call();

                const formattedProjects = projectsData.map((project, index) => ({
                    id: index,
                    name: project.name,
                    description: project.description,
                    allocatedAmount: web3.utils.fromWei(project.allocatedAmount, 'ether'),
                    spentAmount: web3.utils.fromWei(project.spentAmount, 'ether'),
                    projectOwner: project.projectOwner,
                    isActive: project.isActive
                }));

                setProjects(formattedProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Failed to load projects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Prepare chart data for pie/radial chart
    const totalAllocated = projects.reduce((sum, p) => sum + parseFloat(p.allocatedAmount || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + parseFloat(p.spentAmount || 0), 0);
    const remaining = totalAllocated - totalSpent;

    const chartData = [
        { category: "Spent", amount: totalSpent, fill: "hsl(330, 81%, 60%)" },
        { category: "Remaining", amount: remaining, fill: "hsl(221, 83%, 53%)" }
    ];

    const chartConfig = {
        amount: {
            label: "Amount (ETH)",
        },
        Spent: {
            label: "Spent Funds",
            color: "hsl(330, 81%, 60%)",
        },
        Remaining: {
            label: "Remaining Funds",
            color: "hsl(221, 83%, 53%)",
        },
    };

    if (loading) {
        return (
            <div style={{ 
                width: '100%', 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#0f172a'
            }}>
                <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    border: '4px solid rgba(99, 102, 241, 0.3)',
                    borderTop: '4px solid #6366f1',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                width: '100%', 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#0f172a',
                padding: '2rem'
            }}>
                <Card style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <h3 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Error</h3>
                    <p style={{ marginBottom: '1.5rem' }}>{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
                </Card>
            </div>
        );
    }

    return (
        <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={250}
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
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                    {/* Header Section */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '2.5rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '0.5rem'
                            }}>Dashboard</h1>
                            <p style={{ 
                                color: 'rgba(148, 163, 184, 0.9)',
                                fontSize: '1.1rem',
                                fontWeight: '400'
                            }}>Monitor and manage government fund allocation</p>
                        </div>
                        <Link to="/create" style={{ textDecoration: 'none' }}>
                            <Button style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                padding: '0.875rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                            }}
                            >+ New Project</Button>
                        </Link>
                    </div>

                    {/* Statistics Cards */}
                    {projects.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2.5rem'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{ fontSize: '0.875rem', color: 'rgba(148, 163, 184, 0.9)', marginBottom: '0.5rem', fontWeight: '600' }}>Total Projects</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.25rem' }}>{projects.length}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(99, 102, 241, 0.8)' }}>{projects.filter(p => p.isActive).length} Active</div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                                border: '1px solid rgba(236, 72, 153, 0.3)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{ fontSize: '0.875rem', color: 'rgba(148, 163, 184, 0.9)', marginBottom: '0.5rem', fontWeight: '600' }}>Total Allocated</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.25rem' }}>{totalAllocated.toFixed(4)}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(236, 72, 153, 0.8)' }}>ETH</div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(219, 39, 119, 0.05) 100%)',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{ fontSize: '0.875rem', color: 'rgba(148, 163, 184, 0.9)', marginBottom: '0.5rem', fontWeight: '600' }}>Total Spent</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.25rem' }}>{totalSpent.toFixed(4)}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(168, 85, 247, 0.8)' }}>ETH</div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{ fontSize: '0.875rem', color: 'rgba(148, 163, 184, 0.9)', marginBottom: '0.5rem', fontWeight: '600' }}>Remaining</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.25rem' }}>{remaining.toFixed(4)}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(34, 197, 94, 0.8)' }}>ETH</div>
                            </div>
                        </div>
                    )}

            {projects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* Chart Card */}
                    <ChartCard style={{
                        background: 'linear-gradient(180deg, rgba(18, 18, 30, 0.85) 0%, rgba(32, 22, 62, 0.85) 50%, rgba(24, 14, 54, 0.85) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(120, 80, 255, 0.25)',
                        borderRadius: '22px',
                        boxShadow: 'none',
                    }}>
                        <CardHeader>
                            <CardTitle style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>Fund Distribution</CardTitle>
                            <CardDescription style={{ fontSize: '1rem', color: 'rgba(148, 163, 184, 0.8)' }}>Total allocated vs spent funds across all projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} style={{ height: '400px', width: '100%' }} className="">
                                <PieChart width={500} height={400}>
                                    <defs>
                                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.9}/>
                                            <stop offset="95%" stopColor="#db2777" stopOpacity={0.9}/>
                                        </linearGradient>
                                        <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.9}/>
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="amount"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={120}
                                        strokeWidth={3}
                                        stroke="rgba(0,0,0,0.5)"
                                        label={(entry) => `${entry.category}: ${entry.amount.toFixed(4)} ETH`}
                                        labelLine={{ stroke: 'rgba(148, 163, 184, 0.5)', strokeWidth: 2 }}
                                        filter="url(#glow)"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.category === 'Spent' ? 'url(#colorSpent)' : 'url(#colorRemaining)'}
                                            />
                                        ))}
                                    </Pie>
                                    <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </ChartCard>

                    <div>
                        <h2 style={{ 
                            fontSize: '2rem',
                            fontWeight: '700',
                            marginBottom: '1.5rem',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>All Projects</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '2rem'
                        }}>
                            {projects.map((project, idx) => (
                                <Card key={project.id} style={{
                                    background: 'linear-gradient(180deg, rgba(18, 18, 30, 0.85) 0%, rgba(32, 22, 62, 0.85) 50%, rgba(24, 14, 54, 0.85) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(120, 80, 255, 0.25)',
                                    borderRadius: '22px',
                                    padding: '1.75rem',
                                    transition: 'all 0.35s ease',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(160, 90, 255, 0.25), 0 0 40px rgba(70, 120, 255, 0.15)';
                                    e.currentTarget.style.borderColor = 'rgba(160, 90, 255, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(120, 80, 255, 0.25)';
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: `linear-gradient(90deg, hsl(${220 + idx * 30}, 70%, 60%) 0%, hsl(${280 + idx * 30}, 70%, 60%) 100%)`,
                                    }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <h3 style={{ 
                                            fontSize: '1.375rem', 
                                            margin: 0,
                                            fontWeight: '700',
                                            color: '#fff',
                                            flex: 1,
                                            paddingRight: '1rem'
                                        }}>{project.name}</h3>
                                        <Badge variant={project.isActive ? 'success' : 'default'} style={{
                                            background: project.isActive 
                                                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)'
                                                : 'rgba(100, 116, 139, 0.2)',
                                            border: project.isActive ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(100, 116, 139, 0.5)',
                                            color: project.isActive ? '#22c55e' : '#94a3b8',
                                            padding: '0.375rem 0.875rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            borderRadius: '12px'
                                        }}>
                                            {project.isActive ? '● Active' : '○ Inactive'}
                                        </Badge>
                                    </div>

                                    <p style={{ 
                                        color: 'rgba(148, 163, 184, 0.9)', 
                                        marginBottom: '1.5rem',
                                        lineHeight: '1.6',
                                        fontSize: '0.9375rem'
                                    }}>
                                        {project.description.length > 120
                                            ? `${project.description.substring(0, 120)}...`
                                            : project.description}
                                    </p>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'rgba(148, 163, 184, 0.8)', fontWeight: '600' }}>Budget Usage</span>
                                            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: '700' }}>
                                                {((parseFloat(project.spentAmount) / parseFloat(project.allocatedAmount)) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '8px',
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                width: `${Math.min((parseFloat(project.spentAmount) / parseFloat(project.allocatedAmount)) * 100, 100)}%`,
                                                height: '100%',
                                                background: 'linear-gradient(90deg, #ec4899 0%, #a78bfa 100%)',
                                                borderRadius: '12px',
                                                transition: 'width 0.6s ease',
                                                boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)'
                                            }} />
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
                                        padding: '1.25rem',
                                        borderRadius: '16px',
                                        marginBottom: '1.5rem',
                                        border: '1px solid rgba(99, 102, 241, 0.1)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                                            <span style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.875rem', fontWeight: '600' }}>💰 Allocated</span>
                                            <span style={{ fontWeight: '700', fontSize: '1rem', color: '#6366f1' }}>{project.allocatedAmount} ETH</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                                            <span style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.875rem', fontWeight: '600' }}>💸 Spent</span>
                                            <span style={{ fontWeight: '700', fontSize: '1rem', color: '#ec4899' }}>{project.spentAmount} ETH</span>
                                        </div>
                                        <div style={{ height: '1px', background: 'rgba(99, 102, 241, 0.1)', margin: '0.75rem 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.875rem', fontWeight: '600' }}>📊 Available</span>
                                            <span style={{ fontWeight: '700', fontSize: '1rem', color: '#22c55e' }}>
                                                {(parseFloat(project.allocatedAmount) - parseFloat(project.spentAmount)).toFixed(4)} ETH
                                            </span>
                                        </div>
                                    </div>

                                    <Link to={`/project/${project.id}`} style={{ width: '100%', textDecoration: 'none' }}>
                                        <Button variant="outline" style={{ 
                                            width: '100%',
                                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                                            border: '1px solid rgba(99, 102, 241, 0.4)',
                                            color: '#fff',
                                            padding: '0.875rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '600',
                                            borderRadius: '12px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)';
                                            e.target.style.borderColor = 'rgba(168, 85, 247, 0.6)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)';
                                            e.target.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                                        }}
                                        >View Details →</Button>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <Card className="text-center" style={{ 
                    padding: '4rem 2rem',
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '20px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📊</div>
                    <h3 style={{ 
                        marginBottom: '1rem',
                        fontSize: '2rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>No Projects Found</h3>
                    <p style={{ 
                        color: 'rgba(148, 163, 184, 0.9)', 
                        marginBottom: '2.5rem',
                        fontSize: '1.1rem',
                        maxWidth: '500px',
                        margin: '0 auto 2.5rem'
                    }}>
                        Start tracking government funds by creating your first project on the blockchain.
                    </p>
                    <Link to="/create" style={{ textDecoration: 'none' }}>
                        <Button style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            padding: '1rem 2.5rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                        }}>Create First Project</Button>
                    </Link>
                </Card>
            )}
            </div>
        </Vortex>
    );
};

export default Dashboard;