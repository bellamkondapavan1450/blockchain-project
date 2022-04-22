let ControlDevices = artifacts.require("ControlDevices");
let truffleAssert = require("truffle-assertions");

contract("ControlDevices" ,(accounts)=>{
    let account = accounts[0];
    // fectch realtime accout details
    console.log(account);
    let Device;
    beforeEach( async()=> {
        Device = await ControlDevices.new({from:account});
    });
    
    it("", async() => {
        let transactionResult = await obj.emit_test(1);
        // console.log(transactionResult);
        assertions.eventEmitted(transactionResult, "student_event", (event) =>{
            return event.name == "Krishna";
        })
    })
    
});