// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract DataDevices {

    address public owner;  
    uint public id = 0;

    // sensor that will contains name and data sent by our device

    struct device{
        string name;
        uint data;
    }

    // map to store our data with device info in it
    
    mapping(uint=>device) public Devices;

   // setting the owner

    constructor() {
       owner = msg.sender;
    }

    // adding the device to the map

    function add_device(string memory device_name) public{
        require(msg.sender == owner);
        Devices[++id] = device(device_name, 0);
    }

    // removing the device 

    function remove_device(uint _id) public{
        require(msg.sender == owner);
        delete Devices[_id];
    }

    // fetching device's data 

    function get_deviceData(device memory d) public view returns(uint) {
        require(msg.sender == owner);
        return d.data;
    }

    // updating the data

    function update_deviceData(device memory d, uint data) public view {
        require(msg.sender == owner);
        d.data = data;
    }
}