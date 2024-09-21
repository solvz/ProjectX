// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceMarketplace {
    struct Job {
        uint256 id;
        address employer;
        address freelancer;
        string title;
        string description;
        uint256 budget;
        uint256 createdAt;
        bool isActive;
        bool isCompleted;
        bool isDisputed;
    }

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => uint256) public jobBalances; // Escrow balances
    uint256 public jobCount;


    //Events:
    event JobPosted(uint256 id, address employer, string title, uint256 budget);
    event JobAccepted(uint256 jobId, address freelancer);
    event JobCompleted(uint256 jobId);
    event PaymentReleased(uint256 jobId, address freelancer, uint256 amount);
    event JobCancelled(uint256 id);
    event DisputeRaised(uint256 jobId);

    //Modifiers:
    modifier onlyEmployer(uint256 jobId) {
        require(msg.sender == jobs[jobId].employer, "Only employer can perform this action");
        _;
    }

    modifier onlyFreelancer(uint256 jobId) {
        require(msg.sender == jobs[jobId].freelancer, "Only freelancer can perform this action");
        _;
    }

    modifier jobExists(uint256 jobId) {
        require(jobId > 0 && jobId <= jobCount, "Job does not exist");
        _;
    }

    // Function to post a new job
    function postJob(string memory _title, string memory _description, uint256 _budget) public {
        require(_budget > 0, "Budget must be greater than zero");

        jobCount++;
        jobs[jobCount] = Job(jobCount, msg.sender, address(0), _title, _description, _budget, block.timestamp, true, false, false);
        
        emit JobPosted(jobCount, msg.sender, _title, _budget);
    }

    // Function to accept a job (freelancer)
    function acceptJob(uint256 jobId) public jobExists(jobId) {
        require(jobs[jobId].isActive, "Job is not active");
        require(jobs[jobId].freelancer == address(0), "Job has already been accepted");

        jobs[jobId].freelancer = msg.sender;
        emit JobAccepted(jobId, msg.sender);
    }

    // Function to fund the escrow
    function fundEscrow(uint256 jobId) public payable onlyEmployer(jobId) jobExists(jobId) {
        require(msg.value == jobs[jobId].budget, "Must send the exact budget amount");
        jobBalances[jobId] += msg.value;
    }

    // Function to mark job as completed
    function completeJob(uint256 jobId) public onlyFreelancer(jobId) jobExists(jobId) {
        require(jobs[jobId].isActive, "Job is not active");
        require(!jobs[jobId].isCompleted, "Job already completed");

        jobs[jobId].isCompleted = true;
        emit JobCompleted(jobId);
    }

    // Function to release payment to freelancer
    function releasePayment(uint256 jobId) public onlyEmployer(jobId) jobExists(jobId) {
        require(jobs[jobId].isCompleted, "Job is not completed");
        require(jobBalances[jobId] > 0, "No funds in escrow");

        uint256 amount = jobBalances[jobId];
        jobBalances[jobId] = 0;
        payable(jobs[jobId].freelancer).transfer(amount);

        emit PaymentReleased(jobId, jobs[jobId].freelancer, amount);
    }

    // Function to cancel a job
    function cancelJob(uint256 jobId) public onlyEmployer(jobId) jobExists(jobId) {
        require(jobs[jobId].isActive, "Job is not active");

        jobs[jobId].isActive = false;
        emit JobCancelled(jobId);
    }

    // Function to raise a dispute
    function raiseDispute(uint256 jobId) public onlyFreelancer(jobId) jobExists(jobId) {
        require(jobs[jobId].isActive, "Job is not active");
        require(!jobs[jobId].isDisputed, "Dispute already raised");

        jobs[jobId].isDisputed = true;
        emit DisputeRaised(jobId);
    }

    // Function to get job details
    function getJob(uint256 jobId) public view returns (Job memory) {
        require(jobId > 0 && jobId <= jobCount, "Job does not exist");
        return jobs[jobId];
    }
}