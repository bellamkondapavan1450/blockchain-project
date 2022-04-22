var DataDevices = artifacts.require("./DataDevices.sol");

module.exports = function(deployer) {
    deployer.deploy(DataDevices);
}