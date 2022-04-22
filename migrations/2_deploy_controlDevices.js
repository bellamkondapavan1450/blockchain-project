var ControlDevices = artifacts.require("./ControlDevices.sol");

module.exports = function(deployer) {
    deployer.deploy(ControlDevices);
}