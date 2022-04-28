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

    struct room {
        bool status;
        uint thres; //room's threshold
    }
   
    // map to store our data with Devices info in it
   
    mapping(uint=>device) public Devices;
    mapping(uint=>room) public Room;
    uint index;
   
    // setting the owner
   
    constructor()
    {
        owner = msg.sender;
    }

    function addRoomAndDevices() public {
        require(msg.sender == owner);
        Room[++index] = room(false, 10);
        Devices[2*index] = device("Fan", false, false, 0, 0);
        Devices[2*index+1] = device("Light", false, false, 0, 0);
    }

    function deleteRoomAndDevices(uint idx) public {
        require(msg.sender == owner);
        for (uint256 i = idx; i < index; i++) {
            Room[i] = Room[i+1];
            Devices[2*i] = Devices[2*(i+1)];
            Devices[2*i+1] = Devices[2*(i+1)+1];
        }
        delete(Room[index]);
        delete(Devices[2*index]);
        delete(Devices[2*index+1]);
        --index;
    }

    function getNRooms() public view returns(uint) {
        return index;
    }

    function getCurrentActiveTime(uint pin) public view returns(uint) {
        return block.timestamp - Devices[pin].startTime;
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
        if(Devices[pin].status) {
            change_device_status(pin);
        }
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
        return Room[n].status;
    }

    function room_thres(uint n) public view returns(uint)
    {
        return Room[n].thres;
    }
   
    // changing the Room's status
   
    function change_room_status(uint n) public
    {
        if(Room[n].status==true)
        {
            Room[n].status = false;
        }
        else
        {
            Room[n].status = true;
        }
    }
   
    function device_mapping_test(uint _id) public
    {
        emit device_event(Devices[_id].name);
    }

}
