// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JobMarketplace {
    struct Job {
        uint256 id;
        address employer;
        string title;
        string description;
        uint256 payment;
        address worker;
        bool isCompleted;
    }

    uint256 private jobCounter;
    mapping(uint256 => Job) public jobs;
    mapping(address => uint256[]) public employerJobs;
    mapping(address => uint256[]) public workerJobs;

    event JobCreated(uint256 jobId, address employer, string title, uint256 payment);
    event JobTaken(uint256 jobId, address worker);
    event JobCompleted(uint256 jobId);

    function createJob(string memory _title, string memory _description, uint256 _payment) external {
        jobCounter++;
        jobs[jobCounter] = Job(jobCounter, msg.sender, _title, _description, _payment, address(0), false);
        employerJobs[msg.sender].push(jobCounter);
        emit JobCreated(jobCounter, msg.sender, _title, _payment);
    }

    function takeJob(uint256 _jobId) external {
        require(jobs[_jobId].worker == address(0), "Job already taken");
        jobs[_jobId].worker = msg.sender;
        workerJobs[msg.sender].push(_jobId);
        emit JobTaken(_jobId, msg.sender);
    }

    function completeJob(uint256 _jobId) external {
        require(jobs[_jobId].worker == msg.sender, "Only the worker can complete the job");
        require(!jobs[_jobId].isCompleted, "Job already completed");
        jobs[_jobId].isCompleted = true;
        emit JobCompleted(_jobId);
    }

    function getAllJobs() external view returns (Job[] memory) {
        Job[] memory allJobs = new Job[](jobCounter);
        for (uint256 i = 1; i <= jobCounter; i++) {
            allJobs[i - 1] = jobs[i];
        }
        return allJobs;
    }

    function getEmployerJobs(address _employer) external view returns (Job[] memory) {
        uint256[] memory jobIds = employerJobs[_employer];
        Job[] memory employerJobsList = new Job[](jobIds.length);
        for (uint256 i = 0; i < jobIds.length; i++) {
            employerJobsList[i] = jobs[jobIds[i]];
        }
        return employerJobsList;
    }

    function getWorkerJobs(address _worker) external view returns (Job[] memory) {
        uint256[] memory jobIds = workerJobs[_worker];
        Job[] memory workerJobsList = new Job[](jobIds.length);
        for (uint256 i = 0; i < jobIds.length; i++) {
            workerJobsList[i] = jobs[jobIds[i]];
        }
        return workerJobsList;
    }
}
