const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FreelanceMarketplace", function () {
    let contract;
    let employer;
    let freelancer;

    beforeEach(async function () {
        [employer, freelancer] = await ethers.getSigners();
        const FreelanceMarketplace = await ethers.getContractFactory("FreelanceMarketplace");
        contract = await FreelanceMarketplace.deploy();
        await contract.deployed();
    });

    it("should post a job", async function () {
        await contract.postJob("Job Title", "Job Description", ethers.utils.parseEther("1"), { from: employer.address });
        const job = await contract.getJob(1);
        expect(job.title).to.equal("Job Title");
        expect(job.budget).to.equal(ethers.utils.parseEther("1"));
    });

    it("should accept a job", async function () {
        await contract.postJob("Job Title", "Job Description", ethers.utils.parseEther("1"), { from: employer.address });
        await contract.acceptJob(1, { from: freelancer.address });
        const job = await contract.getJob(1);
        expect(job.freelancer).to.equal(freelancer.address);
    });

    it("should fund the escrow", async function () {
        await contract.postJob("Job Title", "Job Description", ethers.utils.parseEther("1"), { from: employer.address });
        await contract.acceptJob(1, { from: freelancer.address });
        await contract.fundEscrow(1, { from: employer.address, value: ethers.utils.parseEther("1") });
        const balance = await contract.jobBalances(1);
        expect(balance).to.equal(ethers.utils.parseEther("1"));
    });

    it("should complete a job and release payment", async function () {
        await contract.postJob("Job Title", "Job Description", ethers.utils.parseEther("1"), { from: employer.address });
        await contract.acceptJob(1, { from: freelancer.address });
        await contract.fundEscrow(1, { from: employer.address, value: ethers.utils.parseEther("1") });
        await contract.completeJob(1, { from: freelancer.address });
        await contract.releasePayment(1, { from: employer.address });

        const balanceAfter = await ethers.provider.getBalance(freelancer.address);
        expect(balanceAfter).to.be.above(ethers.utils.parseEther("0"));
    });
});
