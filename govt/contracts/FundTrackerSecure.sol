// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundTracker {
    // Project structure with hashed data
    struct Project {
        string name;
        string description;
        bytes32 dataHash; // Hash of name + description (privacy)
        uint256 allocatedAmount;
        uint256 spentAmount;
        address projectOwner;
        address[] approvers; // Multiple approvers for security
        bool isActive;
        uint256 createdAt;
        ProjectStatus status;
    }

    enum ProjectStatus {
        Draft,
        Active,
        Paused,
        Completed,
        Cancelled
    }

    // Spending record with category
    struct SpendingRecord {
        uint256 projectId;
        uint256 amount;
        string category; // e.g., "Infrastructure", "Personnel", "Materials"
        address spentBy;
        address receiver; // Address that receives the funds
        uint256 timestamp;
        bool approved;
        bytes32 descriptionHash; // Hash of spending description
    }

    // User roles for access control
    mapping(address => bool) public isGovernmentOfficial;
    mapping(address => bool) public isAdmin;

    Project[] public projects;
    SpendingRecord[] public spendingRecords;
    mapping(uint256 => uint256[]) public projectSpendingRecords; // projectId => spending record IDs

    // Events
    event ProjectCreated(
        uint256 indexed projectId,
        bytes32 indexed dataHash,
        address indexed projectOwner,
        uint256 allocatedAmount,
        uint256 timestamp
    );

    event FundsSpent(
        uint256 indexed projectId,
        uint256 amount,
        string category,
        bytes32 descriptionHash,
        address indexed spentBy,
        address indexed receiver,
        uint256 timestamp
    );

    event ProjectStatusChanged(
        uint256 indexed projectId,
        ProjectStatus newStatus,
        uint256 timestamp
    );

    event ApprovalAdded(
        uint256 indexed projectId,
        address indexed approver,
        uint256 timestamp
    );

    event ApprovalRemoved(
        uint256 indexed projectId,
        address indexed approver,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can perform this action");
        _;
    }

    modifier onlyOfficial() {
        require(
            isGovernmentOfficial[msg.sender] || isAdmin[msg.sender],
            "Only government officials can perform this action"
        );
        _;
    }

    modifier onlyProjectOwner(uint256 _projectId) {
        require(
            _projectId < projects.length,
            "Project does not exist"
        );
        require(
            msg.sender == projects[_projectId].projectOwner,
            "Only project owner can perform this action"
        );
        _;
    }

    modifier projectExists(uint256 _projectId) {
        require(_projectId < projects.length, "Project does not exist");
        _;
    }

    // Constructor
    constructor() {
        isAdmin[msg.sender] = true;
    }

    // Admin Functions
    function addGovernmentOfficial(address _official) public onlyAdmin {
        isGovernmentOfficial[_official] = true;
    }

    function removeGovernmentOfficial(address _official) public onlyAdmin {
        isGovernmentOfficial[_official] = false;
    }

    function addAdmin(address _admin) public onlyAdmin {
        isAdmin[_admin] = true;
    }

    function removeAdmin(address _admin) public onlyAdmin {
        isAdmin[_admin] = false;
    }

    // Project Management Functions
    function createProject(
        string memory _name,
        string memory _description,
        bytes32 _dataHash, // Hash of (name + description)
        uint256 _allocatedAmount,
        address _projectOwner
    ) public payable returns (uint256) {
        require(bytes(_name).length > 0, "Project name cannot be empty");
        require(bytes(_description).length > 0, "Project description cannot be empty");
        require(_dataHash != bytes32(0), "Data hash cannot be empty");
        require(_allocatedAmount > 0, "Allocated amount must be greater than 0");
        require(msg.value == _allocatedAmount, "Sent ETH must equal allocated amount");
        require(_projectOwner != address(0), "Invalid project owner");

        Project memory newProject = Project({
            name: _name,
            description: _description,
            dataHash: _dataHash,
            allocatedAmount: _allocatedAmount,
            spentAmount: 0,
            projectOwner: _projectOwner,
            approvers: new address[](0),
            isActive: true,
            createdAt: block.timestamp,
            status: ProjectStatus.Active  // Set to Active so funds can be spent immediately
        });

        projects.push(newProject);
        uint256 projectId = projects.length - 1;

        emit ProjectCreated(
            projectId,
            _dataHash,
            _projectOwner,
            _allocatedAmount,
            block.timestamp
        );

        return projectId;
    }

    // Add approver to project
    function addApprover(uint256 _projectId, address _approver)
        public
        onlyProjectOwner(_projectId)
    {
        require(_approver != address(0), "Invalid approver address");
        
        Project storage project = projects[_projectId];
        
        // Check if already approver
        for (uint256 i = 0; i < project.approvers.length; i++) {
            require(project.approvers[i] != _approver, "Already an approver");
        }
        
        project.approvers.push(_approver);
        emit ApprovalAdded(_projectId, _approver, block.timestamp);
    }

    // Remove approver from project
    function removeApprover(uint256 _projectId, address _approver)
        public
        onlyProjectOwner(_projectId)
    {
        Project storage project = projects[_projectId];
        
        for (uint256 i = 0; i < project.approvers.length; i++) {
            if (project.approvers[i] == _approver) {
                project.approvers[i] = project.approvers[project.approvers.length - 1];
                project.approvers.pop();
                emit ApprovalRemoved(_projectId, _approver, block.timestamp);
                return;
            }
        }
        
        revert("Approver not found");
    }

    // Spend funds with approval workflow
    function spendFunds(
        uint256 _projectId,
        uint256 _amount,
        string memory _category,
        bytes32 _descriptionHash,
        address payable _receiver
    ) public projectExists(_projectId) {
        Project storage project = projects[_projectId];
        
        require(project.isActive, "Project is not active");
        require(project.status == ProjectStatus.Active, "Project is not in Active status");
        require(msg.sender == project.projectOwner, "Only project owner can spend funds");
        require(_amount > 0, "Amount must be greater than 0");
        require(
            project.allocatedAmount >= project.spentAmount + _amount,
            "Insufficient funds"
        );
        require(bytes(_category).length > 0, "Category cannot be empty");
        require(_receiver != address(0), "Invalid receiver address");
        require(address(this).balance >= _amount, "Contract has insufficient balance");

        // Create spending record
        SpendingRecord memory record = SpendingRecord({
            projectId: _projectId,
            amount: _amount,
            category: _category,
            spentBy: msg.sender,
            receiver: _receiver,
            timestamp: block.timestamp,
            approved: false,
            descriptionHash: _descriptionHash
        });

        spendingRecords.push(record);
        uint256 recordId = spendingRecords.length - 1;
        projectSpendingRecords[_projectId].push(recordId);

        project.spentAmount += _amount;
        
        // Actually transfer the ETH to receiver
        (bool success, ) = _receiver.call{value: _amount}("");
        require(success, "ETH transfer failed");

        emit FundsSpent(
            _projectId,
            _amount,
            _category,
            _descriptionHash,
            msg.sender,
            _receiver,
            block.timestamp
        );
    }

    // Change project status
    function setProjectStatus(uint256 _projectId, ProjectStatus _newStatus)
        public
        onlyProjectOwner(_projectId)
    {
        Project storage project = projects[_projectId];
        project.status = _newStatus;
        
        if (_newStatus == ProjectStatus.Paused || _newStatus == ProjectStatus.Completed) {
            project.isActive = false;
        } else if (_newStatus == ProjectStatus.Active) {
            project.isActive = true;
        }

        emit ProjectStatusChanged(_projectId, _newStatus, block.timestamp);
    }

    // View Functions
    function getProjectCount() public view returns (uint256) {
        return projects.length;
    }

    function getProject(uint256 _projectId)
        public
        view
        projectExists(_projectId)
        returns (Project memory)
    {
        return projects[_projectId];
    }

    function getProjectHash(uint256 _projectId)
        public
        view
        projectExists(_projectId)
        returns (bytes32)
    {
        return projects[_projectId].dataHash;
    }

    function getProjectApprovers(uint256 _projectId)
        public
        view
        projectExists(_projectId)
        returns (address[] memory)
    {
        return projects[_projectId].approvers;
    }

    function getProjectSpendingRecords(uint256 _projectId)
        public
        view
        projectExists(_projectId)
        returns (SpendingRecord[] memory)
    {
        uint256[] memory recordIds = projectSpendingRecords[_projectId];
        SpendingRecord[] memory records = new SpendingRecord[](recordIds.length);
        
        for (uint256 i = 0; i < recordIds.length; i++) {
            records[i] = spendingRecords[recordIds[i]];
        }
        
        return records;
    }

    function getAllProjects() public view returns (Project[] memory) {
        return projects;
    }

    // Simplified view for frontend
    function getProjectsSimple() public view returns (
        string[] memory names,
        string[] memory descriptions,
        uint256[] memory amounts,
        uint256[] memory spent,
        address[] memory owners,
        bool[] memory active
    ) {
        uint256 len = projects.length;
        names = new string[](len);
        descriptions = new string[](len);
        amounts = new uint256[](len);
        spent = new uint256[](len);
        owners = new address[](len);
        active = new bool[](len);
        
        for (uint256 i = 0; i < len; i++) {
            names[i] = projects[i].name;
            descriptions[i] = projects[i].description;
            amounts[i] = projects[i].allocatedAmount;
            spent[i] = projects[i].spentAmount;
            owners[i] = projects[i].projectOwner;
            active[i] = projects[i].isActive;
        }
    }

    function getSpendingRecord(uint256 _recordId)
        public
        view
        returns (SpendingRecord memory)
    {
        require(_recordId < spendingRecords.length, "Record does not exist");
        return spendingRecords[_recordId];
    }

    // Get remaining funds for a project
    function getRemainingFunds(uint256 _projectId)
        public
        view
        projectExists(_projectId)
        returns (uint256)
    {
        Project storage project = projects[_projectId];
        return project.allocatedAmount - project.spentAmount;
    }

    // Get spending percentage for a project
    function getSpendingPercentage(uint256 _projectId)
        public
        view
        projectExists(_projectId)
        returns (uint256)
    {
        Project storage project = projects[_projectId];
        if (project.allocatedAmount == 0) return 0;
        return (project.spentAmount * 100) / project.allocatedAmount;
    }
}
