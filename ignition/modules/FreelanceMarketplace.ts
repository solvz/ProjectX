import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const FreelanceMarketplaceModule = buildModule("FreelanceMarketplaceModule", (m) => {
  // Deploy the FreelanceMarketplace contract
  const freelanceMarketplace = m.contract("FreelanceMarketplace");

  // Optional: You can add post-deployment steps here if needed
  // For example, posting a job:
  m.call(freelanceMarketplace, "postJob", ["Web Developer", "Build a website", ethers.parseEther("1")]);

  return { freelanceMarketplace };
});

export default FreelanceMarketplaceModule;
