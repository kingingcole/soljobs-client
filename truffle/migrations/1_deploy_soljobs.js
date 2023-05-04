const SolJobs = artifacts.require("SolJobs");

module.exports = function (deployer) {
  deployer.deploy(SolJobs);
};
