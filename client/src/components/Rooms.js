import React from "react";
import Navbar from "./Navbar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import axios from 'axios';
import { addDevice, changeDeviceStatus, changeRoomStatus, getDeviceStatus, getRoomStatus, removeDevice } from "../Web3Client";

function Rooms() {

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
      if(res) {
        removeDevice((2*n)).on('confirmation', function(confirmationNumber, receipt) {
          console.log("Confirmation Number: "+ confirmationNumber);
          console.log(receipt);
          console.log(`Device at pin(${2*n}) is removed.`);
        });
        // console.log(`Device at pin(${2*n}) is removed.`);
        removeDevice((2*n+1)).on('confirmation', function(confirmationNumber, receipt) {
          console.log("Confirmation Number: "+confirmationNumber);
          console.log(receipt);
          console.log(`Device at pin(${2*n+1}) is removed.`);
        });
        // removeDevice((2*n+1));
        // console.log(`Device at pin(${2*n+1}) is removed.`);
      } else {
        addDevice((2*n), "Light").then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2*n}) is added.`);
        });
        addDevice((2*n+1), "Fan").then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2*n+1}) is added.`);
        });
      }
      changeRoomStatus(n).then((tnx) => {
        console.log(tnx);
        console.log(`State changed Room(${n})`);
      });
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
                />
                <FormControlLabel
                  onChange={() => changeStatus(2)}
                  control={<Switch color="primary" />}
                  label="Fan"
                />
                <FormControlLabel
                  onChange={() => changeStatus(3)}
                  control={<Switch color="primary" />}
                  label="Light"
                />
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
                />
                <FormControlLabel
                  onChange={() => changeStatus(4)}
                  control={<Switch color="primary" />}
                  label="Fan"
                />
                <FormControlLabel
                  onChange={() => changeStatus(5)}
                  control={<Switch color="primary" />}
                  label="Light"
                />
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
                />
                <FormControlLabel
                  onChange={() => changeStatus(6)}
                  control={<Switch color="primary" />}
                  label="Fan"
                />
                <FormControlLabel
                  onChange={() => changeStatus(7)}
                  control={<Switch color="primary" />}
                  label="Light"
                />
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
                />
                <FormControlLabel
                  onChange={() => changeStatus(8)}
                  control={<Switch color="primary" />}
                  label="Fan"
                />
                <FormControlLabel
                  onChange={() => changeStatus(9)}
                  control={<Switch color="primary" />}
                  label="Light"
                />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rooms;
