// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceMarketplace {
    struct Job {
        uint256 id;
        address employer;
        string title;
        string description;
        uint256 budget;
        uint256 createdAt;
        bool isActive;
    }

    mapping(uint256 => Job) public jobs;
    uint256 public jobCount;

    event JobPosted(uint256 id, address employer, string title, uint256 budget);
    event JobCancelled(uint256 id);

    modifier onlyEmployer(uint256 jobId) {
        require(msg.sender == jobs[jobId].employer, "Only employer can perform this action");
        _;
    }

    // Function to post a new job
    function postJob(string memory _title, string memory _description, uint256 _budget) public {
        require(_budget > 0, "Budget must be greater than zero");

        jobCount++;
        jobs[jobCount] = Job(jobCount, msg.sender, _title, _description, _budget, block.timestamp, true);
        
        emit JobPosted(jobCount, msg.sender, _title, _budget);
    }

    // Function to cancel a job
    function cancelJob(uint256 jobId) public onlyEmployer(jobId) {
        require(jobs[jobId].isActive, "Job is not active");

        jobs[jobId].isActive = false;
        emit JobCancelled(jobId);
    }

    // Function to get job details
    function getJob(uint256 jobId) public view returns (Job memory) {
        require(jobId > 0 && jobId <= jobCount, "Job does not exist");
        return jobs[jobId];
    }
}
