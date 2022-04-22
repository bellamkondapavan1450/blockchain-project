// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract ControlDevices 
{
    address public owner;

    event device_event(string name);

    // sensor that will contains name and status sent by our device
    
    struct device 
    {
        string name;
        bool status;
    }
    
    // map to store our data with device info in it
    
    mapping(uint=>device) public Devices;
    mapping(uint=>bool) public Room;
    
    // setting the owner
    
    constructor() 
    {
        owner = msg.sender;
        Room[1] = false;
        Room[2] = false;
        Room[3] = false;
        Room[4] = false;
    }

    // adding the device 

    function add_device(uint pin, string memory device_name) public 
    {
        require(msg.sender == owner);
        Devices[pin] = device(device_name, false);
    }

    // removing the device 

    function remove_device(uint pin) public 
    {
        require(msg.sender == owner);
        delete Devices[pin];
    }
    
    // checking the status of device whether it's on or off
    
    function device_status(uint pin) public view returns(bool) 
    {
        return Devices[pin].status;
    }
    
    // changing the device's status
    
    function change_device_status(uint pin) public 
    {
        if(Devices[pin].status==true) 
        {
            Devices[pin].status = false;
        }
        else 
        {
            Devices[pin].status = true;
        }
    }

    function room_status(uint n) public view returns(bool) 
    {
        return Room[n];
    }
    
    // changing the Room's status
    
    function change_room_status(uint n) public 
    {
        if(Room[n]==true) 
        {
            Room[n] = false;
        }
        else 
        {
            Room[n] = true;
        }
    }
    
    function device_mapping_test(uint _id) public 
    {
        emit device_event(Devices[_id].name);
    }

}