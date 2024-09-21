// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceMarketplace {
    enum JobStatus { Created, Funded, Completed, Disputed, Resolved }
    enum DisputeResolution { None, ClientWins, FreelancerWins }

    struct Job {
        address payable client;
        address payable freelancer;
        uint256 amount;
        JobStatus status;
        DisputeResolution disputeResolution;
    }

    struct Dispute {
        uint256 jobId;
        uint256 clientVotes;
        uint256 freelancerVotes;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Dispute) public disputes;
    uint256 public jobCounter;

    address public owner;
    uint256 public platformFeePercentage;
    address[] public arbitrators;
    uint256 public constant REQUIRED_VOTES = 3;

    event JobCreated(uint256 jobId, address client, address freelancer, uint256 amount);
    event JobFunded(uint256 jobId);
    event JobCompleted(uint256 jobId);
    event DisputeRaised(uint256 jobId);
    event DisputeResolved(uint256 jobId, DisputeResolution resolution);
    event ArbitratorAdded(address arbitrator);
    event ArbitratorRemoved(address arbitrator);

    constructor(uint256 _platformFeePercentage) {
        owner = msg.sender;
        platformFeePercentage = _platformFeePercentage;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Only the client can call this function");
        _;
    }

    modifier onlyFreelancer(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].freelancer, "Only the freelancer can call this function");
        _;
    }

    modifier onlyArbitrator() {
        bool isArbitrator = false;
        for (uint i = 0; i < arbitrators.length; i++) {
            if (arbitrators[i] == msg.sender) {
                isArbitrator = true;
                break;
            }
        }
        require(isArbitrator, "Only arbitrators can call this function");
        _;
    }

    function createJob(address payable _freelancer) external payable returns (uint256) {
        require(msg.value > 0, "Job amount must be greater than 0");

        uint256 jobId = jobCounter++;
        jobs[jobId] = Job({
            client: payable(msg.sender),
            freelancer: _freelancer,
            amount: msg.value,
            status: JobStatus.Created,
            disputeResolution: DisputeResolution.None
        });

        emit JobCreated(jobId, msg.sender, _freelancer, msg.value);
        return jobId;
    }

    function fundJob(uint256 _jobId) external payable onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Created, "Job must be in Created status");
        require(msg.value == job.amount, "Funding amount must match job amount");

        job.status = JobStatus.Funded;
        emit JobFunded(_jobId);
    }

    function completeJob(uint256 _jobId) external onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Funded, "Job must be in Funded status");

        uint256 platformFee = (job.amount * platformFeePercentage) / 100;
        uint256 freelancerPayment = job.amount - platformFee;

        job.status = JobStatus.Completed;
        job.freelancer.transfer(freelancerPayment);
        payable(owner).transfer(platformFee);

        emit JobCompleted(_jobId);
    }

    function raiseDispute(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client || msg.sender == job.freelancer, "Only client or freelancer can raise a dispute");
        require(job.status == JobStatus.Funded, "Job must be in Funded status");

        job.status = JobStatus.Disputed;
        disputes[_jobId].jobId = _jobId;
        emit DisputeRaised(_jobId);
    }

    function voteOnDispute(uint256 _jobId, bool _voteForClient) external onlyArbitrator {
        Job storage job = jobs[_jobId];
        Dispute storage dispute = disputes[_jobId];

        require(job.status == JobStatus.Disputed, "Job must be in Disputed status");
        require(!dispute.hasVoted[msg.sender], "Arbitrator has already voted");

        dispute.hasVoted[msg.sender] = true;

        if (_voteForClient) {
            dispute.clientVotes++;
        } else {
            dispute.freelancerVotes++;
        }

        if (dispute.clientVotes + dispute.freelancerVotes >= REQUIRED_VOTES) {
            resolveDispute(_jobId);
        }
    }

    function resolveDispute(uint256 _jobId) private {
        Job storage job = jobs[_jobId];
        Dispute storage dispute = disputes[_jobId];

        job.status = JobStatus.Resolved;

        uint256 platformFee = (job.amount * platformFeePercentage) / 100;
        uint256 remainingAmount = job.amount - platformFee;

        if (dispute.clientVotes > dispute.freelancerVotes) {
            job.disputeResolution = DisputeResolution.ClientWins;
            job.client.transfer(remainingAmount);
        } else if (dispute.freelancerVotes > dispute.clientVotes) {
            job.disputeResolution = DisputeResolution.FreelancerWins;
            job.freelancer.transfer(remainingAmount);
        } else {
            // In case of a tie, split the remaining amount
            uint256 halfAmount = remainingAmount / 2;
            job.client.transfer(halfAmount);
            job.freelancer.transfer(halfAmount);
        }

        payable(owner).transfer(platformFee);

        emit DisputeResolved(_jobId, job.disputeResolution);
    }

    function addArbitrator(address _arbitrator) external onlyOwner {
        for (uint i = 0; i < arbitrators.length; i++) {
            require(arbitrators[i] != _arbitrator, "Arbitrator already exists");
        }
        arbitrators.push(_arbitrator);
        emit ArbitratorAdded(_arbitrator);
    }

    function removeArbitrator(address _arbitrator) external onlyOwner {
        for (uint i = 0; i < arbitrators.length; i++) {
            if (arbitrators[i] == _arbitrator) {
                arbitrators[i] = arbitrators[arbitrators.length - 1];
                arbitrators.pop();
                emit ArbitratorRemoved(_arbitrator);
                return;
            }
        }
        revert("Arbitrator not found");
    }

    function getJobDetails(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }

    function getArbitrators() external view returns (address[] memory) {
        return arbitrators;
    }

    function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
        platformFeePercentage = _newFeePercentage;
    }
}