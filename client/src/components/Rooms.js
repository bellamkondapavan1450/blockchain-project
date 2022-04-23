import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import axios from 'axios';
import { addDevice, changeDeviceStatus, changeRoomStatus, getDeviceStatus, getRoomStatus, removeDevice } from "../Web3Client";

function Rooms() {
  
  const [room1,setRoom1] = useState(false);
  const [room2,setRoom2] = useState(false);
  const [room3,setRoom3] = useState(false);
  const [room4,setRoom4] = useState(false);

  // lifecycle function for called before the component rendering
  useEffect(()=>{
    // fetch power status
    getRoomStatus(1).then((res) => {
      console.log("Power status of room1 :  "+ Boolean(res));
      // setting the state of room1 
      setRoom1(Boolean(res));
    });

    getRoomStatus(2).then((res) => {
      console.log("Power status of room2: "+ Boolean(res));
      // setting the state of room1 
      setRoom2(Boolean(res));
    });

    getRoomStatus(3).then((res) => {
      console.log("Power status of room3: "+ Boolean(res));
      // setting the state of room1 
      setRoom3(Boolean(res));
    });

    getRoomStatus(4).then((res) => {
      console.log("Power status of room4: "+ Boolean(res));
      // setting the state of room1 
      setRoom4(Boolean(res));
    });

  });


  function renderRoom1Button(){
    if(room1 === true){
        return(
          <div>
            <FormControlLabel
              onChange={() => changeStatus(2)}
              control={<Switch color="primary" />}
              label="Fan"
            /> 
            <br/>
            <FormControlLabel
              onChange={() => changeStatus(3)}
              control={<Switch color="primary" />}
              label="Light"
            /> 
          </div>
        );
    }
  }

  function renderRoom2Button(){
    if(room2 === true){
        return(
          <div>
            <FormControlLabel
              onChange={() => changeStatus(4)}
              control={<Switch color="primary" />}
              label="Fan"
            /> 
            <br/>
            <FormControlLabel
              onChange={() => changeStatus(5)}
              control={<Switch color="primary" />}
              label="Light"
            /> 
          </div>
        );
    }
  }

  function renderRoom3Button(){
    if(room3 === true){
        return(
          <div>
            <FormControlLabel
              onChange={() => changeStatus(6)}
              control={<Switch color="primary" />}
              label="Fan"
            /> 
            <br/>
            <FormControlLabel
              onChange={() => changeStatus(7)}
              control={<Switch color="primary" />}
              label="Light"
            /> 
          </div>
        );
    }
  }

  function renderRoom4Button(){
    if(room4 === true){
        return(
          <div>
            <FormControlLabel
              onChange={() => changeStatus(8)}
              control={<Switch color="primary" />}
              label="Fan"
            /> 
            <br/>
            <FormControlLabel
              onChange={() => changeStatus(9)}
              control={<Switch color="primary" />}
              label="Light"
            /> 
          </div>
        );
    }
  }

  function on_led(p) {
    axios.get(`http://localhost:5000/ledon?pin=${p}`).then((res) => {
      console.log("Satus", res.data);
    });
  }

  function off_led(p) {
    axios.get(`http://localhost:5000/ledoff?pin=${p}`).then((res) => {
      console.log("Satus", res.data);
    });
  }

  function changeState(n) {
    getRoomStatus(n).then((res) => {
      console.log("Current Room State: "+ res);
      changeRoomStatus(n).then((tnx) => {
        console.log(tnx);
        console.log(`State changed Room(${n})`);
      });
      if(res) {
        
        removeDevice((2*n)).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2*n}) is removed.`);
          
        });
        removeDevice((2*n+1)).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2*n+1}) is removed.`);
        });
      } else {
        // changing the power state to true
        addDevice((2*n)).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2*n}) is added.`);
        });
        addDevice((2*n+1)).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2*n+1}) is added.`);
        });
      }

    });
  }

  function changeStatus(p) {
    getRoomStatus(parseInt(p/2)).then((res) => {
      if(res) {
        console.log("Room is powered on");
        getDeviceStatus(p).then((res) => {
          console.log("Device Status: "+ res);
          changeDeviceStatus(p).then((tnx) => {
            if(!res) {
              on_led(p);
            } else {
              off_led(p);
            }
            console.log(tnx);
            console.log(`Status changed pin(${p})`);
          });
        });
      } else {
        console.log("Room is powered off, Operation not posible.");
      }
    });
  }

  // function getStatus(n) {
  //   getRoomStatus(n).then((res) => {
  //     console.log("jngf  "+ Boolean(res));
  //     return true;
  //   });
  // }


  return (
    <div className="App">
      <Navbar />
      <div className="main2">
        <div className="rw">
          <div className="rom">
            <div className="rtit">
              <span>ROOM1</span>
            </div>
            <div className="components">
              <FormGroup>
                <FormControlLabel
                  onChange={() => changeState(1)}
                  control={<Switch color="primary" />}
                  label="Power"
                  checked={room1}
                />
                {renderRoom1Button()}
                </FormGroup>
            </div>
          </div>
          <div className="rom">
            <div className="rtit">
              <span>ROOM2</span>
            </div>
            <div className="components">
              <FormGroup>
                <FormControlLabel
                  onChange={() => changeState(2)}
                  control={<Switch color="primary" />}
                  label="Power"
                  checked={room2}
                />
                {renderRoom2Button()}
              </FormGroup>
            </div>
          </div>
        </div>
        <div className="rw">
          <div className="rom">
            <div className="rtit">
              <span>ROOM3</span>
            </div>
            <div className="components">
              <FormGroup>
                <FormControlLabel
                  onChange={() => changeState(3)}
                  control={<Switch color="primary" />}
                  label="Power"
                  checked={room3}
                />
                {renderRoom3Button()}
              </FormGroup>
            </div>
          </div>
          <div className="rom">
            <div className="rtit">
              <span>ROOM4</span>
            </div>
            <div className="components">
              <FormGroup>
                <FormControlLabel
                  onChange={() => changeState(4)}
                  control={<Switch color="primary" />}
                  label="Power"
                  checked={room4}
                />
                {renderRoom4Button()}
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rooms;
