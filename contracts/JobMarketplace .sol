// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JobMarketplace {
    struct Job {
        uint256 id;
        address payable employer;
        address payable freelancer;
        string title;
        string description;
        uint256 payment;
        JobStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }

    enum JobStatus { Open, InProgress, Completed, Cancelled, Disputed }

    uint256 private jobCounter;
    mapping(uint256 => Job) public jobs;
    mapping(address => uint256[]) public employerJobs;
    mapping(address => uint256[]) public freelancerJobs;

    uint256 public platformFeePercentage = 5; // 5% platform fee

    event JobCreated(uint256 jobId, address employer, string title, uint256 payment);
    event JobTaken(uint256 jobId, address freelancer);
    event JobCompleted(uint256 jobId);
    event JobCancelled(uint256 jobId);
    event DisputeRaised(uint256 jobId);
    event DisputeResolved(uint256 jobId, address winner);
    event FundsReleased(uint256 jobId, address recipient, uint256 amount);

    modifier onlyEmployer(uint256 _jobId) {
        require(jobs[_jobId].employer == msg.sender, "Only the employer can perform this action");
        _;
    }

    modifier onlyFreelancer(uint256 _jobId) {
        require(jobs[_jobId].freelancer == msg.sender, "Only the freelancer can perform this action");
        _;
    }

    modifier jobExists(uint256 _jobId) {
        require(_jobId > 0 && _jobId <= jobCounter, "Job does not exist");
        _;
    }

    function createJob(string memory _title, string memory _description) external payable {
        require(msg.value > 0, "Payment must be greater than 0");

        jobCounter++;
        jobs[jobCounter] = Job(
            jobCounter,
            payable(msg.sender),
            payable(address(0)),
            _title,
            _description,
            msg.value,
            JobStatus.Open,
            block.timestamp,
            0
        );
        employerJobs[msg.sender].push(jobCounter);
        emit JobCreated(jobCounter, msg.sender, _title, msg.value);
    }

    function takeJob(uint256 _jobId) external jobExists(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Open, "Job is not open");
        require(job.employer != msg.sender, "Employer cannot take their own job");

        job.freelancer = payable(msg.sender);
        job.status = JobStatus.InProgress;
        freelancerJobs[msg.sender].push(_jobId);
        emit JobTaken(_jobId, msg.sender);
    }

    function completeJob(uint256 _jobId) external jobExists(_jobId) onlyFreelancer(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.InProgress, "Job is not in progress");

        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;
        emit JobCompleted(_jobId);
    }

    function releasePayment(uint256 _jobId) external jobExists(_jobId) onlyEmployer(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Completed, "Job is not completed");

        uint256 platformFee = (job.payment * platformFeePercentage) / 100;
        uint256 freelancerPayment = job.payment - platformFee;

        job.status = JobStatus.Completed;
        job.freelancer.transfer(freelancerPayment);
        payable(address(this)).transfer(platformFee);

        emit FundsReleased(_jobId, job.freelancer, freelancerPayment);
    }

    function cancelJob(uint256 _jobId) external jobExists(_jobId) onlyEmployer(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Open || job.status == JobStatus.InProgress, "Cannot cancel job in current status");

        if (job.status == JobStatus.InProgress) {
            // If in progress, split the payment between employer and freelancer
            uint256 halfPayment = job.payment / 2;
            job.employer.transfer(halfPayment);
            job.freelancer.transfer(halfPayment);
        } else {
            // If open, return full payment to employer
            job.employer.transfer(job.payment);
        }

        job.status = JobStatus.Cancelled;
        emit JobCancelled(_jobId);
    }

    function raiseDispute(uint256 _jobId) external jobExists(_jobId) {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.employer || msg.sender == job.freelancer, "Only employer or freelancer can raise a dispute");
        require(job.status == JobStatus.InProgress || job.status == JobStatus.Completed, "Cannot raise dispute in current status");

        job.status = JobStatus.Disputed;
        emit DisputeRaised(_jobId);
    }

    // In a real-world scenario, this function would be called by a trusted arbitrator or through a more complex governance mechanism
    function resolveDispute(uint256 _jobId, address payable _winner) external jobExists(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Disputed, "Job is not in disputed status");
        require(_winner == job.employer || _winner == job.freelancer, "Winner must be employer or freelancer");

        job.status = JobStatus.Completed;
        _winner.transfer(job.payment);

        emit DisputeResolved(_jobId, _winner);
        emit FundsReleased(_jobId, _winner, job.payment);
    }

    function getJob(uint256 _jobId) external view jobExists(_jobId) returns (Job memory) {
        return jobs[_jobId];
    }

    function getAllJobs() external view returns (Job[] memory) {
        Job[] memory allJobs = new Job[](jobCounter);
        for (uint256 i = 1; i <= jobCounter; i++) {
            allJobs[i - 1] = jobs[i];
        }
        return allJobs;
    }

    function getEmployerJobs(address _employer) external view returns (Job[] memory) {
        return _getJobsForAddress(_employer, employerJobs[_employer]);
    }

    function getFreelancerJobs(address _freelancer) external view returns (Job[] memory) {
        return _getJobsForAddress(_freelancer, freelancerJobs[_freelancer]);
    }

    function _getJobsForAddress(address _user, uint256[] storage jobIds) private view returns (Job[] memory) {
        Job[] memory userJobs = new Job[](jobIds.length);
        for (uint256 i = 0; i < jobIds.length; i++) {
            userJobs[i] = jobs[jobIds[i]];
        }
        return userJobs;
    }

    // Function to withdraw platform fees (should be called by contract owner or through a governance mechanism)
    function withdrawPlatformFees() external {
        // Implement access control here
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
