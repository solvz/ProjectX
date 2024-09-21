import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { FreelanceMarketplace } from "../typechain-types/FreelanceMarketplace";

describe("FreelanceMarketplace", function () {
  let contract: FreelanceMarketplace;
  let employer: Signer;
  let freelancer: Signer;

  beforeEach(async function () {
    [employer, freelancer] = await ethers.getSigners();
    const FreelanceMarketplaceFactory = await ethers.getContractFactory(
      "FreelanceMarketplace"
    );
    contract =
      (await FreelanceMarketplaceFactory.deploy()) as FreelanceMarketplace;
    await contract.waitForDeployment();
  });

  it("should post a job", async function () {
    await contract.postJob(
      "Job Title",
      "Job Description",
      ethers.parseEther("1")
    );
    const job = await contract.getJob(1);
    expect(job.title).to.equal("Job Title");
    expect(job.budget).to.equal(ethers.parseEther("1"));
  });

  it("should accept a job", async function () {
    await contract.postJob(
      "Job Title",
      "Job Description",
      ethers.parseEther("1")
    );
    await contract.connect(freelancer).acceptJob(1);
    const job = await contract.getJob(1);
    expect(job.freelancer).to.equal(await freelancer.getAddress());
  });

  it("should fund the escrow", async function () {
    await contract.postJob(
      "Job Title",
      "Job Description",
      ethers.parseEther("1")
    );
    await contract.connect(freelancer).acceptJob(1);
    await contract.fundEscrow(1, { value: ethers.parseEther("1") });
    const balance = await contract.jobBalances(1);
    expect(balance).to.equal(ethers.parseEther("1"));
  });

  it("should complete a job and release payment", async function () {
    await contract.postJob(
      "Job Title",
      "Job Description",
      ethers.parseEther("1")
    );
    await contract.connect(freelancer).acceptJob(1);
    await contract.fundEscrow(1, { value: ethers.parseEther("1") });
    await contract.connect(freelancer).completeJob(1);
    await contract.releasePayment(1);

    const balanceAfter = await ethers.provider.getBalance(
      await freelancer.getAddress()
    );
    expect(balanceAfter).to.be.above(ethers.parseEther("0"));
  });
});
