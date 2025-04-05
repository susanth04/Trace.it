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

    Project[] public projects;

    event ProjectCreated(uint256 projectId, string name, uint256 allocatedAmount);
    event FundsSpent(uint256 projectId, uint256 amount);

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

    function spendFunds(uint256 _projectId, uint256 _amount) public {
        require(_projectId < projects.length, "Project does not exist");
        Project storage project = projects[_projectId];
        require(project.isActive, "Project is not active");
        require(msg.sender == project.projectOwner, "Only the project owner can spend funds");
        require(project.allocatedAmount >= project.spentAmount + _amount, "Insufficient funds");

        project.spentAmount += _amount;
        emit FundsSpent(_projectId, _amount);
    }

    function getProjects() public view returns (Project[] memory) {
        return projects;
    }
}
