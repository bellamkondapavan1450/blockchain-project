import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import axios from "axios";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {
  addDevice,
  addRoomAndDevices,
  changeDeviceStatus,
  changeRoomStatus,
  deleteRoomAndDevices,
  getCurrentActiveTime,
  getDeviceStatus,
  getNRooms,
  getRoomStatus,
  getRoomThres,
  getTotalTime,
  removeDevice,
} from "../Web3Client";

function Rooms() {

  const fanVoltage = 4.5,
  fanCurrent = 17,
  lightVoltage = 1.78,
  lightCurrent = 4.5;

  const [showToast,setToast] = useState(false);
  const [msg,setMsg] = useState("");
  const [showModal,setModal] = useState(false);
  const [showDialog,setDialog] = useState(false);
  

  const [rooms,setRooms] = useState([]);
  const [N, setN] = useState(0);
  const [E, setE] = useState(0);
  const [T, setT] = useState(0);
  const [C, setC] = useState(7.9398387763);
  const [MT, setMT] = useState(50);
  const [device, setDevice] = useState('Room 1 [Light]');
  const [deviceEnergy, setDeviceEnergy] = useState(1.043533366);

  // function delay(delayInms) {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve(2);
  //     }, delayInms);
  //   });
  // }

  const thresCheck=()=>{
    getNRooms().then((res)=>{
      let n=parseInt(res);
      for(let i=1;i<=n;i++){
        getRoomThres(i).then((res)=>{
          let t = parseInt(res);
          let fEnergy, lEnergy;
          getTotalTime(2*i).then((res)=>{
            fEnergy=fanVoltage*fanCurrent*parseInt(res)/3600;
            getTotalTime(2*i+1).then(async (res)=>{
              lEnergy=lightVoltage*lightCurrent*parseInt(res)/3600;
              let tEnergy = fEnergy+lEnergy;
              if(tEnergy > t) {
                console.log(`called ${i}`);
                setN(i);
                setE(tEnergy);
                setT(t);
                setModal(true);
              }
            }); 
          });
        });
      }
    });
    setTimeout(thresCheck, 30000);
  }

  const loadBalancing = (p) => {
    getNRooms().then((res) => {
      const mainThres = 50;
      let n = parseInt(res);
      for(let i=1; i<n; i++) {
        getDeviceStatus(2*i).then((res) => {
          if(Boolean(res)) {
            getCurrentActiveTime(2*i).then((res) => {
              let compEnergy = fanVoltage*fanCurrent*parseInt(res)/3600;
              if(deviceEnergy < compEnergy) {
                setDeviceEnergy(compEnergy);
                setDevice(`Room ${i} [Fan]`);
              }
              setC(C+compEnergy);
            });

          }
        });
        getDeviceStatus(2*i+1).then((res) => {
          if(Boolean(res)) {
            let compEnergy = lightVoltage*lightCurrent*parseInt(res)/3600;
            if(deviceEnergy < compEnergy) {
              setDeviceEnergy(compEnergy);
                setDevice(`Room ${i} [Light]`);
            }
            setC(C+compEnergy);
          }
          if(i === n-1) {
            console.log(C, "   jjeinfe  ", mainThres);
            if(C > mainThres) {
              console.log(C, "   jjeinfe  ", mainThres);
              console.log(C, " ", device, " ", deviceEnergy);
              setMT(mainThres);
              setDialog(true);
            } else {
              changeDeviceStatus(p).then((tnx) => {
                let n1 = parseInt(p/2);
                let copyrooms = [...rooms];
                if(p%2 === 0) {
                  copyrooms[n1-1].fan = !Boolean(res);
                  setRooms(copyrooms);
                } else {
                  copyrooms[n1-1].light = !Boolean(res);
                  setRooms(copyrooms);
                }
                if (!res) {
                  on_led(p);
                } else {
                  off_led(p);
                }
                console.log(tnx);
                console.log(`Status changed pin(${p})`);
              });
            }
          }
        });
      }
    });
  }

  const addRoom = () =>{
    if(rooms.length === 6) {
      setMsg("Can't add more than 6 rooms");
      setToast(true);
      return;
    }
    let copyrooms = [...rooms];
    addRoomAndDevices().then((res) => {
      console.log(res);
      copyrooms.push({
        id: copyrooms.length+1,
        name: `Room ${copyrooms.length+1}`,
        state: false,
        fan: false,
        light: false,
      });
      console.log(copyrooms);
      setRooms(copyrooms);
      console.log(rooms);
    });
  };

  const delete_room = (idx) => {
    let copyrooms = [...rooms];
    deleteRoomAndDevices(idx).then((res) => {
      console.log(res);
      console.log(`Room ${idx} is deleted and Upadating other rooms.`);
      copyrooms.splice(idx-1, 1);
      for(let i=idx-1; i<copyrooms.length; i++) {
        copyrooms[i].id = i+1;
        copyrooms[i].name = `Room ${i+1}`
      }
      console.log(copyrooms);
      setRooms(copyrooms);
    });
  }

 

  const renderRooms = () =>{
    let l = rooms.length;
    let rows = [];
    let i = 0;
    while(i<l){
      if(i%3 === 0 || i<3){
        rows.push(
          <div className="row" key={i}>
            {
              rooms.slice(i,i+3).map(e => {
                // console.log(e);
                return (
                <div className="rom" key={e.id}>
                  <div className="rtit">
                    <span className="roo">{e.name}</span>
                    <span className="material-symbols-outlined" style={{marginRight:"20px",cursor:"pointer"}} onClick={()=>{delete_room(e.id)}}>
                      delete
                    </span>
                  </div>
                  <div className="components">
                    <FormGroup>
                      <FormControlLabel
                        onChange={() => changeState(e.id)}
                        control={<Switch color="primary" />}
                        label="Power"
                        checked={e.state}
                      />
                      {e.state && 
                        <div>
                          <FormControlLabel
                            onChange={() => {changeStatus(2*e.id);
                            console.log(2*e.id);}}
                            control={<Switch color="primary" />}
                            label="Fan"
                            checked={e.fan}
                          />
                          <br />
                          <FormControlLabel
                            onChange={() => changeStatus(2*e.id+1)}
                            control={<Switch color="primary" />}
                            label="Light"
                            checked={e.light}
                          />
                        </div>
                      }
                    </FormGroup>
                  </div>
                </div>)
              })
            }
          </div>
        );
        i+=3;
      }
    }
    return (<div className="main2">
      {rows}
    </div>);
    
  };


  useEffect(() => {
    let copyrooms = [];
    getNRooms().then((res) => {
      let n = parseInt(res);
      console.log("Total No. of Rooms : ", n);
      for(let i=0; i<n; i++) {
        copyrooms[i] = {
          id: copyrooms.length+1,
          name: `Room ${i+1}`,
          state:false,
          fan: false,
          light:false,
        }
  
        getRoomStatus(i+1).then((res) => {
          
          console.log(`Power status of room ${i+1} : ${Boolean(res)}`);
          // setting the state of room1
          copyrooms[i].state = Boolean(res);
  
          if(Boolean(res)) {
            getDeviceStatus(2*(i+1)).then((res) => {
              console.log(`Fan status of room ${i+1} : ${Boolean(res)}`);
              copyrooms[i].fan = Boolean(res);
            });
            getDeviceStatus(2*(i+1)+1).then((res) => {
              console.log(`Light status of room ${i+1} : ${Boolean(res)}`);
              copyrooms[i].light = Boolean(res);
              if(i === n-1) {
                setRooms(copyrooms);
                console.log(copyrooms);
              }
            });
          } else {
            copyrooms[i].fan = false;
            copyrooms[i].light = false;
              if(i === n-1) {
                setRooms(copyrooms);
                console.log(copyrooms);
              }
          }
         
        });
      }
    });
    thresCheck();
  }, []);

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
      let copyrooms = [...rooms];
      if (res) {

        removeDevice(2 * n).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2 * n}) is removed.`);
          copyrooms[n-1].fan = false;
        });

        removeDevice(2 * n + 1).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2 * n + 1}) is removed.`);
          copyrooms[n-1].light = false;
        });

        changeRoomStatus(n).then((tnx) => {
          console.log(tnx);
          console.log(`State changed Room(${n})`);
          copyrooms[n-1].state = false;
          setRooms(copyrooms);
        });
        
      } else {
        
        addDevice(2 * n).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2 * n}) is added.`);
          copyrooms[n-1].fan = false;
        });
        addDevice(2 * n + 1).then((tnx) => {
          console.log(tnx);
          console.log(`Device at pin(${2 * n + 1}) is added.`);
          copyrooms[n-1].light = false;
        });

        changeRoomStatus(n).then((tnx) => {
          console.log(tnx);
          console.log(`State changed Room(${n})`);
          copyrooms[n-1].state = true;
          setRooms(copyrooms);
        });
        
      }
      
    });
  }

  function changeStatus(p) {
    let n1 = parseInt(p/2);
    console.log("Not overloaded...")
    getRoomStatus(n1).then((res) => {
      if (res) {
        let copyrooms = [...rooms];
        console.log(`Room ${n1} is powered on`);
        getDeviceStatus(p).then((res) => {
          console.log("Device Status: " + res);
          if(!Boolean(res)) {
            loadBalancing(p);
          } else {
            changeDeviceStatus(p).then((tnx) => {
              if(p%2 === 0) {
                copyrooms[n1-1].fan = !Boolean(res);
                setRooms(copyrooms);
              } else {
                copyrooms[n1-1].light = !Boolean(res);
                setRooms(copyrooms);
              }
              if (!res) {
                on_led(p);
              } else {
                off_led(p);
              }
              console.log(tnx);
              console.log(`Status changed pin(${p})`);
            });
          }
        });
      } else {
        console.log(`Room ${n1} is powered off, Operation not posible.`);
      }
    });

    // getNRooms().then((res) => {
    //   let temp = 0, temp2 = '';
    //   let total = 0;
    //   const mainThres = 50;
    //   let n = parseInt(res);
    //   for(let i=1; i<n; i++) {
    //     getDeviceStatus(2*i).then((res) => {
    //       if(Boolean(res)) {
    //         getCurrentActiveTime(2*i).then((res) => {
    //           let compEnergy = fanVoltage*fanCurrent*parseInt(res)/3600;
    //           if(temp < compEnergy) {
    //             temp = compEnergy;
    //             temp2 = `Room ${i} [Fan]`;
    //           }
    //           total += compEnergy;
    //         });

    //       }
    //     });
    //     getDeviceStatus(2*i+1).then((res) => {
    //       if(Boolean(res)) {
    //         let compEnergy = lightVoltage*lightCurrent*parseInt(res)/3600;
    //         if(temp < compEnergy) {
    //           temp = compEnergy;
    //           temp2 = `Room ${i} [Light]`;
    //         }
    //         total += compEnergy;
    //       }
    //       if(i === n-1) {
    //         if(total < mainThres) {
    //           console.log("overloaded...")
    //           setC(total);
    //           setMT(mainThres);
    //           setDevice(temp2);
    //           setDeviceEnergy(temp);
    //           setDialog(true);
    //         }
    //       }
    //     });
    //   }
    // });
  }

  const closeModal = () => {
    setModal(false);
  }

  const closeDialog = () => {
    setDialog(false);
  }

  return (
    <div className="App">
      <Snackbar
            open={showToast}
            onClose={()=>setToast(false)}
            TransitionComponent={Slide}
            message={msg}
            autoHideDuration={3000}
            key={'created'}
            disableWindowBlurListener={true}
            sx={{ width: "350px" }}
        >
            <Alert onClose={()=>setToast(false)} variant="filled" severity="error" sx={{ width: '100%' }} >
            {msg}
            </Alert>
        </Snackbar>
        <Dialog
          open={showModal}
          onClose={closeModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Room Energy Threshold Alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You Energy Consumtion has exceeded the Energy Threshold Limit of Room{N} <br/> Energy Consumed: {E} <br/> Room Threshold: {T}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => {closeModalDisagree(N)}}>NO</Button> */}
          <Button onClick={closeModal} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
          open={showDialog}
          onClose={closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Overload Alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          The current load on the main is exceeded the threshold limit.<br/>
          Current load: {C} <br/>
          Main Threshold: {MT} <br/><br/>
          To use this device, turn off the {device} which is consuming {deviceEnergy} energy.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => {closeModalDisagree(N)}}>NO</Button> */}
          <Button onClick={closeDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Navbar />
      <div className="main2">

        <div className="btnbox">
            <button className="addRoom" style={{marginRight:"20px",cursor:"pointer"}} onClick={()=>addRoom()}> Add Room </button>

        </div>
        {
          renderRooms()
        }
      </div>
    </div>
  );
}

export default Rooms;