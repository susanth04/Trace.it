// Mock data for development/testing
export const mockProjects = [
  {
    name: "School Infrastructure Project",
    description: "Construction and renovation of government schools in urban areas",
    allocatedAmount: "50",
    spentAmount: "32.5",
    projectOwner: "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb5",
    isActive: true,
  },
  {
    name: "Healthcare Facility Upgrade",
    description: "Modernizing hospital equipment and facilities in rural regions",
    allocatedAmount: "75",
    spentAmount: "45.2",
    projectOwner: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    isActive: true,
  },
  {
    name: "Road Development Initiative",
    description: "Building and maintaining highways and local roads infrastructure",
    allocatedAmount: "150",
    spentAmount: "89.7",
    projectOwner: "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb5",
    isActive: true,
  },
  {
    name: "Water Supply System",
    description: "Installing clean water distribution network for municipalities",
    allocatedAmount: "100",
    spentAmount: "60.3",
    projectOwner: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    isActive: false,
  },
  {
    name: "Digital Infrastructure",
    description: "Setting up broadband and digital connectivity in remote areas",
    allocatedAmount: "80",
    spentAmount: "25.1",
    projectOwner: "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb5",
    isActive: true,
  },
];

export function generateMockProjects() {
  return mockProjects;
}
