import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import axios from "axios";
import {
  addDevice,
  changeDeviceStatus,
  changeRoomStatus,
  getDeviceStatus,
  getRoomStatus,
  removeDevice,
} from "../Web3Client";

function Rooms() {
  const [room1, setRoom1] = useState(false);
  const [room2, setRoom2] = useState(false);
  const [room3, setRoom3] = useState(false);
  const [room4, setRoom4] = useState(false);
  const [fanRoom1, setFanRoom1] = useState(false);
  const [fanRoom2, setFanRoom2] = useState(false);
  const [fanRoom3, setFanRoom3] = useState(false);
  const [fanRoom4, setFanRoom4] = useState(false);
  const [lightRoom1, setLightRoom1] = useState(false);
  const [lightRoom2, setLightRoom2] = useState(false);
  const [lightRoom3, setLightRoom3] = useState(false);
  const [lightRoom4, setLightRoom4] = useState(false);

  // lifecycle function for called before the component rendering
  useEffect(() => {
    // fetch power status
    getRoomStatus(1).then((res) => {
      console.log("Power status of room1 :  " + Boolean(res));
      // setting the state of room1
      setRoom1(Boolean(res));
      if(Boolean(res)) {
        getDeviceStatus(2).then((res) => {
          console.log("Fan status of room1 :  " + Boolean(res));
          setFanRoom1(Boolean(res))
        });
        getDeviceStatus(3).then((res) => {
          console.log("Light status of room1 :  " + Boolean(res));
          setLightRoom1(Boolean(res));
        });
      } else {
        setFanRoom1(false);
        setLightRoom1(false);
      }
    });

    getRoomStatus(2).then((res) => {
      console.log("Power status of room2 :  " + Boolean(res));
      // setting the state of room1
      setRoom2(Boolean(res));
      if(Boolean(res)) {
        getDeviceStatus(4).then((res) => {
          console.log("Fan status of room2 :  " + Boolean(res));
          setFanRoom2(Boolean(res));
        });
        getDeviceStatus(5).then((res) => {
          console.log("Light status of room2 :  " + Boolean(res));
          setLightRoom2(Boolean(res));
        });
      } else {
        setFanRoom2(false);
        setLightRoom2(false);
      }
    });

    getRoomStatus(3).then((res) => {
      console.log("Power status of room3 :  " + Boolean(res));
      // setting the state of room1
      setRoom3(Boolean(res));
      if(Boolean(res)) {
        getDeviceStatus(6).then((res) => {
          console.log("Fan status of room3 :  " + Boolean(res));
          setFanRoom3(Boolean(res))
        });
        getDeviceStatus(7).then((res) => {
          console.log("Light status of room3 :  " + Boolean(res));
          setLightRoom3(Boolean(res));
        });
      } else {
        setFanRoom3(false);
        setLightRoom3(false);
      }
    });

    getRoomStatus(4).then((res) => {
      console.log("Power status of room4 :  " + Boolean(res));
      // setting the state of room1
      setRoom4(Boolean(res));
      if(Boolean(res)) {
        getDeviceStatus(8).then((res) => {
          console.log("Fan status of room4 :  " + Boolean(res));
          setFanRoom4(Boolean(res))
        });
        getDeviceStatus(9).then((res) => {
          console.log("Light status of room4 :  " + Boolean(res));
          setLightRoom4(Boolean(res));
        });
      } else {
        setFanRoom4(false);
        setLightRoom4(false);
      }
    });
  });

  function renderRoom1Button() {
    if (room1 === true) {
      return (
        <div>
          <FormControlLabel
            onChange={() => changeStatus(2)}
            control={<Switch color="primary" />}
            label="Fan"
            checked={fanRoom1}
          />
          <br />
          <FormControlLabel
            onChange={() => changeStatus(3)}
            control={<Switch color="primary" />}
            label="Light"
            checked={lightRoom1}
          />
        </div>
      );
    }
  }

  function renderRoom2Button() {
    if (room2 === true) {
      return (
        <div>
          <FormControlLabel
            onChange={() => changeStatus(4)}
            control={<Switch color="primary" />}
            label="Fan"
            checked={fanRoom2}
          />
          <br />
          <FormControlLabel
            onChange={() => changeStatus(5)}
            control={<Switch color="primary" />}
            label="Light"
            checked={lightRoom2}
          />
        </div>
      );
    }
  }

  function renderRoom3Button() {
    if (room3 === true) {
      return (
        <div>
          <FormControlLabel
            onChange={() => changeStatus(6)}
            control={<Switch color="primary" />}
            label="Fan"
            checked={fanRoom3}
          />
          <br />
          <FormControlLabel
            onChange={() => changeStatus(7)}
            control={<Switch color="primary" />}
            label="Light"
            checked={lightRoom3}
          />
        </div>
      );
    }
  }

  function renderRoom4Button() {
    if (room4 === true) {
      return (
        <div>
          <FormControlLabel
            onChange={() => changeStatus(8)}
            control={<Switch color="primary" />}
            label="Fan"
            checked={fanRoom4}
          />
          <br />
          <FormControlLabel
            onChange={() => changeStatus(9)}
            control={<Switch color="primary" />}
            label="Light"
            checked={lightRoom4}
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
      console.log("Current Room State: " + res);
      if (res) {
        
        removeDevice(2 * n).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2 * n}) is removed.`);
          if(n === 1) {
            setFanRoom1(false);
          } else if(n === 2) {
            setFanRoom2(false);
          } else if(n === 3) {
            setFanRoom3(false);
          } else {
            setFanRoom4(false);
          }
        });

        removeDevice(2 * n + 1).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2 * n + 1}) is removed.`);
          if(n === 1) {
            setLightRoom1(false);
          } else if(n === 2) {
            setLightRoom2(false);
          } else if(n === 3) {
            setLightRoom3(false);
          } else {
            setLightRoom4(false);
          }
        });

        changeRoomStatus(n).then((tnx) => {
          console.log(tnx);
          console.log(`State changed Room(${n})`);
          if(n === 1) {
            setRoom1(false);
          } else if(n === 2) {
            setRoom2(false);
          } else if(n === 3) {
            setRoom3(false);
          } else {
            setRoom4(false);
          }
        });
        
      } else {
        
        addDevice(2 * n).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2 * n}) is added.`);
        });
        addDevice(2 * n + 1).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2 * n + 1}) is added.`);
        });

        changeRoomStatus(n).then((tnx) => {
          console.log(tnx);
          console.log(`State changed Room(${n})`);
          if(n === 1) {
            setFanRoom1(false);
            setLightRoom1(false);
            setRoom1(true);
          } else if(n === 2) {
            setFanRoom2(false);
            setLightRoom2(false);
            setRoom2(true);
          } else if(n === 3) {
            setFanRoom3(false);
            setLightRoom3(false);
            setRoom3(true);
          } else {
            setFanRoom4(false);
            setLightRoom4(false);
            setRoom4(true);
          }
        });
        
      }
      
    });
  }

  function changeStatus(p) {
    let n = parseInt(p/2);
    getRoomStatus(n).then((res) => {
      if (res) {
        console.log(`Room ${n} is powered on`);
        getDeviceStatus(p).then((res) => {
          console.log("Device Status: " + res);
          changeDeviceStatus(p).then((tnx) => {
            if(n === 1) {
              if(p%2 === 0) {
                setFanRoom1(!res);
              } else {
                setLightRoom1(!res);
              }
            } else if(n === 2) {
              if(p%2 === 0) {
                setFanRoom2(!res);
              } else {
                setLightRoom2(!res);
              }
            } else if(n === 3) {
              if(p%2 === 0) {
                setFanRoom3(!res);
              } else {
                setLightRoom3(!res);
              }
            } else {
              if(p%2 === 0) {
                setFanRoom4(!res);
              } else {
                setLightRoom4(!res);
              }
            }
            if (!res) {
              on_led(p);
            } else {
              off_led(p);
            }
            console.log(tnx);
            
            console.log(`Status changed pin(${p})`);
          });
        });
      } else {
        console.log(`Room ${n} is powered off, Operation not posible.`);
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