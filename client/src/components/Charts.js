import React, { useState } from 'react';
import { getTotalTime } from '../Web3Client';
import Navbar from './Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Button } from '@material-ui/core';
// import faker from '@faker-js/faker';
// import { deflate } from 'zlib';



// export default function App() {
//   return <Bar options={options} data={data} />;
// }

function Charts(){
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );
      
    const fanVoltage = 12, fanCurrent = 10, lightVoltage = 12, lightCurrent = 10;

       const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        //   title: {
        //     display: true,
        //     text: '',
        //   },
        },
      };

    //   const pieOptions = {
    //     title:{
    //       display:true,
    //       text:'Average Rainfall per month',
    //       fontSize:20
    //     },
    //     legend:{
    //       display:true,
    //       position:'right'
    //     }
    //   };
      
      const labels = ['Room1', 'Room2', 'Room3', 'Room4'];
      
    // var data = {
    //     labels,
    //     datasets: [
    //       {
    //         label: 'Fan',
    //         data:[10,0,0,0] , // fetch the data of fan 
    //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //       },
    //       {
    //         label: 'Light',
    //         data:[0,10,0,0], // fetch the data of lights
    //         backgroundColor: 'rgba(53, 162, 235, 0.5)',
    //       },
    //     ],
    //   };

    // const [fan,setFan] = useState([]);
    // const [light,setLight] = useState([]);
    // const [up,setUp] = useState(false);
    const [barData,setBarData] = useState({
        labels,
        datasets: [
          {
            label: 'Fan',
            data:[0,0,0,0] , // fetch the data of fan 
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Light',
            data:[0,0,0,0], // fetch the data of lights
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      });
      const [pieData,setPieData] = useState({
        labels,
        datasets: [
          {
            label: 'Energy Usage',
            backgroundColor: [
                '#B21F00',
                '#C9DE00',
                '#2FDE00',
                '#00A6B4'
              ],
              hoverBackgroundColor: [
              '#501800',
              '#4B5000',
              '#175000',
              '#003350'
              ],
            data:[0,0,0,0] , // fetch the data of fan 
          },
        ],
      });


    const fetchDataOfDevices = ()=>{
        let fanArr = [],lightArr = [],pieArr=[];
        let total = 0;
        for(let i = 1;i<=4;i++){
            // data["datasets"][0]["data"][i-1] = parseInt(await getTotalTime(2*i));
            // // console.log(`Fan ${i} : ${data["datasets"][0]["data"][i-1]}`);

            // data["datasets"][1]["data"][i-1] = parseInt(await getTotalTime(2*i+1));

            getTotalTime(2*i).then((res)=>{
                console.log(`Fan ${i} : ${res}`);
                fanArr.push(fanVoltage*fanCurrent*parseInt(res));
                // data["datasets"][0]["data"][i-1] = parseInt(res);
                // setFan(fanArr);
                // data["datasets"][0]["data"] = fan;
            });
            getTotalTime(2*i+1).then((res)=>{
                console.log(`Light ${i} : ${res}`);
                lightArr.push(lightVoltage*lightCurrent*parseInt(res));
                pieArr.push(parseFloat(lightArr[i-1]+fanArr[i-1]));
                total += pieArr[i-1];
                // data["datasets"][1]["data"][i-1] = parseInt(res);
                // setLight(lightArr);
                // data["datasets"][1]["data"] = light;
                if(i === 4){
                    console.log(barData);
                    // setUp(true);
                    setBarData({
                        labels,
                        datasets: [
                          {
                            label: 'Fan',
                            data:fanArr , // fetch the data of fan 
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                          },
                          {
                            label: 'Light',
                            data:lightArr, // fetch the data of lights
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                          },
                        ],
                      });
                      for(let i=0; i<4; i++) {
                          pieArr[i] = parseFloat((pieArr[i]*100)/total);
                      }
                      setPieData({
                        labels,
                        datasets: [
                          {
                            label: 'Energy Usage',
                            backgroundColor: [
                                '#B21F00',
                                '#C9DE00',
                                '#2FDE00',
                                '#00A6B4'
                              ],
                              hoverBackgroundColor: [
                              '#501800',
                              '#4B5000',
                              '#175000',
                              '#003350'
                              ],
                            data:pieArr , // fetch the data of fan 
                          },
                        ],
                      });
                    
                }
                
            });
            // fanArr.push(getTotalTime(2*i));
            // lightArr.push(getTotalTime(2*i+1));
        }
        // console.log(data);
    };
    
    // useEffect(()=>{
    //     // update the state with the fetched data from the blockchain
    //     fetchDataOfDevices();
    //     // setUp(true);
        
    // });
    
    
//     const renderGraph = ()=>{
// //         if(up === false){
// //             console.log("Loading ......")
// //             return (
// //                 <div>Loading .........</div>
// //             );
// //         }
// //         else{
// //             console.log(`data in else : `,data["datasets"]);
// //             return(
// // <               Bar options={options} data={data} /> 
// //             );
// //         }
//         return(
//             < Bar options={options} data={barData} /> );
//     };

    return (
        <div className="App">
        <Navbar />
        <div className="main2">
            <Button onClick={fetchDataOfDevices}>Refresh Graphs</Button>
        <div className="rw">
          <div className="rom">
            <div className="rtit">
              <span>Energy Consumed</span>
            </div>
            <div className="components">
            <Bar options={options} data={barData} />
            </div>
          </div>
          <div className="rom">
            <div className="rtit">
              <span>% of Total Energy Consumed</span>
            </div>
            <div className="components">
            {/* <Doughnut  data={pieData} /> */}
            <Bar options={options} data={pieData} />

            </div>
          </div>
        </div>
        </div>
      </div>
        
    );
}

export default Charts;