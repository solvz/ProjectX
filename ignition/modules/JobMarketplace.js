const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("JobMarketplaceModule", (m) => {
  const jobMarketplace = m.contract("JobMarketplace");

  return { jobMarketplace };
});
