// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract ControlDevices
{
    address public owner;

    event device_event(string name);

    // sensor that will contains name and status sent by our Devices
   
    struct device
    {
        string name;
        bool power;
        bool status;
        uint startTime;
        uint totalTime;
    }
   
    // map to store our data with Devices info in it
   
    mapping(uint=>device) public Devices;
    mapping(uint=>bool) public Room;
   
    // setting the owner
   
    constructor()
    {
        owner = msg.sender;
        Room[1] = false;
        Devices[2] = device("Fan", false, false, 0, 0);
        Devices[3] = device("Light", false, false, 0, 0);
        Room[2] = false;
        Devices[4] = device("Fan", false, false, 0, 0);
        Devices[5] = device("Light", false, false, 0, 0);
        Room[3] = false;
        Devices[6] = device("Fan", false, false, 0, 0);
        Devices[7] = device("Light", false, false, 0, 0);
        Room[4] = false;
        Devices[8] = device("Fan", false, false, 0, 0);
        Devices[9] = device("Light", false, false, 0, 0);
    }

    function getTotalTime(uint pin) public view returns(uint) {
        // return the total time
        // when switched on
        if(Devices[pin].startTime != 0){
           return block.timestamp - Devices[pin].startTime + Devices[pin].totalTime;
        }
        // when switched off
        return Devices[pin].totalTime;
    }
    // adding the Devices

    function add_device(uint pin) public
    {
        require(msg.sender == owner);
        Devices[pin].power = true;
    }

    // removing the Devices

    function remove_device(uint pin) public
    {
        require(msg.sender == owner);
        Devices[pin].power = false;
    }
   
    // checking the status of Devices whether it's on or off
   
    function device_status(uint pin) public view returns(bool)
    {
        return Devices[pin].status;
    }
   
    // changing the Devices's status
   
    function change_device_status(uint pin) public
    {
        // switching off
        if(Devices[pin].status==true)
        {
            Devices[pin].status = false;
            // adding time to totalTime
            if(Devices[pin].startTime != 0){
                Devices[pin].totalTime += block.timestamp - Devices[pin].startTime;
            }
            Devices[pin].startTime = 0;
        }
        else
        {
            // switching on
            Devices[pin].status = true;
            Devices[pin].startTime = block.timestamp;
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
