// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundTracker {
    struct Project {
        string name;
        string description;
        uint256 allocatedAmount;
        uint256 spentAmount;
        address projectOwner;
        bool isActive;
    }

    struct Transaction {
        uint256 amount;
        string description;
        address receiver;
        uint256 timestamp;
    }

    Project[] public projects;
    mapping(uint256 => Transaction[]) public projectTransactions;

    event ProjectCreated(uint256 projectId, string name, uint256 allocatedAmount);
    event FundsSpent(uint256 projectId, uint256 amount, string description, address receiver);

    function createProject(
        string memory _name,
        string memory _description,
        uint256 _allocatedAmount,
        address _projectOwner
    ) public returns (uint256) {
        projects.push(Project(_name, _description, _allocatedAmount, 0, _projectOwner, true));
        uint256 projectId = projects.length - 1;
        emit ProjectCreated(projectId, _name, _allocatedAmount);
        return projectId;
    }

    function spendFunds(
        uint256 _projectId, 
        uint256 _amount, 
        string memory _description, 
        address _receiver
    ) public {
        require(_projectId < projects.length, "Project does not exist");
        Project storage project = projects[_projectId];
        require(project.isActive, "Project is not active");
        require(msg.sender == project.projectOwner, "Only the project owner can spend funds");
        require(project.allocatedAmount >= project.spentAmount + _amount, "Insufficient funds");

        project.spentAmount += _amount;
        
        Transaction memory newTransaction = Transaction({
            amount: _amount,
            description: _description,
            receiver: _receiver,
            timestamp: block.timestamp
        });

        projectTransactions[_projectId].push(newTransaction);
        
        emit FundsSpent(_projectId, _amount, _description, _receiver);
    }

    function getProjects() public view returns (Project[] memory) {
        return projects;
    }

    function getProjectTransactions(uint256 _projectId) public view returns (Transaction[] memory) {
        return projectTransactions[_projectId];
    }
}
