const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JobMarketplaceModule = buildModule("JobMarketplaceModule", (m) => {
  const jobMarketplace = m.contract("JobMarketplace");

  // You can add more configuration or additional contracts here if needed

  return { jobMarketplace };
});

module.exports = JobMarketplaceModule;