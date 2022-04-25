import React, { useState } from "react";
import { getTotalTime } from "../Web3Client";
import Navbar from "./Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  BarController,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Button } from "@material-ui/core";
import { Chart } from "react-google-charts";


// import faker from '@faker-js/faker';
// import { deflate } from 'zlib';

// export default function App() {
//   return <Bar options={options} data={data} />;
// }

function Charts() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    BarController,
    PieController,
    Title,
    Tooltip,
    Legend
  );

  const fanVoltage = 4.5,
    fanCurrent = 17,
    lightVoltage = 1.78,
    lightCurrent = 4.5;

  const options = {
    responsive: true,
    scales: {
      yAxes: {
        title: {
            display: true,
            text: "Energy (in kWh)",
            
        }
      }
    },
    plugins: {
      legend: {
        position: "top",
      },
      // title: {
      //   display: true,
      //   text: 'jkfvk',
      // },
    },
  };

    // const pieOptions = {
    //   title:{
    //     display:true,
    //     text:'Average Rainfall per month',
    //     fontSize:20
    //   },
    //   legend:{
    //     display:true,
    //     position:'right'
    //   }
    // };

  const labels = ["Room1", "Room2", "Room3", "Room4"];

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
  const [barData, setBarData] = useState({
    labels,
    datasets: [
      {
        label: "Fan",
        data: [0, 0, 0, 0], // fetch the data of fan
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Light",
        data: [0, 0, 0, 0], // fetch the data of lights
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });
  // const [pieData, setPieData] = useState({
  //   labels,
  //   datasets: [
  //     {
  //       label: "Energy Usage(%)",
  //       backgroundColor: ["#B21F00", "#C9DE00", "#2FDE00", "#00A6B4"],
  //       hoverBackgroundColor: ["#501800", "#4B5000", "#175000", "#003350"],
  //       data: [0, 0, 0, 0], // fetch the data of fan
  //     },
  //   ],
  // });

  const [data, setData] = useState([
    ["Rooms", "Usage"],
    ["Room 1", 0],
    ["Room 2", 0],
    ["Room 3", 0],
    ["Room 4", 0]
  ]);

  const fetchDataOfDevices = () => {
    let fanArr = [],
      lightArr = [],
      pieArr = [];
    // let total = 0;
    for (let i = 1; i <= 4; i++) {
      // data["datasets"][0]["data"][i-1] = parseInt(await getTotalTime(2*i));
      // // console.log(`Fan ${i} : ${data["datasets"][0]["data"][i-1]}`);

      // data["datasets"][1]["data"][i-1] = parseInt(await getTotalTime(2*i+1));

      getTotalTime(2 * i).then((res) => {
        console.log(`Fan ${i} : ${res}`);
        fanArr.push(fanVoltage * fanCurrent * parseInt(res));
        // data["datasets"][0]["data"][i-1] = parseInt(res);
        // setFan(fanArr);
        // data["datasets"][0]["data"] = fan;
      });
      getTotalTime(2 * i + 1).then((res) => {
        console.log(`Light ${i} : ${res}`);
        lightArr.push(parseFloat(lightVoltage * lightCurrent * parseInt(res)));
        pieArr.push(parseFloat(lightArr[i - 1] + fanArr[i - 1]));
        // total += pieArr[i - 1];
        // data["datasets"][1]["data"][i-1] = parseInt(res);
        // setLight(lightArr);
        // data["datasets"][1]["data"] = light;
        if (i === 4) {
          for (let i = 0; i < 4; i++) {
            fanArr[i] = parseFloat(fanArr[i] / 3600);
            lightArr[i] = parseFloat(lightArr[i] / 3600);
            pieArr[i] = parseFloat(pieArr[i] / 3600);
          }
          setData([
            ["Rooms", "Usage (in kWh)"],
            ["Room 1", pieArr[0]],
            ["Room 2", pieArr[1]],
            ["Room 3", pieArr[2]],
            ["Room 4", pieArr[3]]
          ])
          // setUp(true);
          setBarData({
            labels,
            datasets: [
              {
                label: "Fan(kWh)",
                data: fanArr, // fetch the data of fan
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
              {
                label: "Light(kWh)",
                data: lightArr, // fetch the data of lights
                backgroundColor: "rgba(53, 162, 235, 0.5)",
              },
            ],
          });
      //     setPieData({
      //       labels,
      //       datasets: [
      //         {
      //           label: "Energy Usage(%)",
      //           backgroundColor: ["#B21F00", "#C9DE00", "#2FDE00", "#00A6B4"],
      //           hoverBackgroundColor: [
      //             "#501800",
      //             "#4B5000",
      //             "#175000",
      //             "#003350",
      //           ],
      //           data: pieArr, // fetch the data of fan
      //         },
      //       ],
      //     });
        }
      });
      // fanArr.push(getTotalTime(2*i));
      // lightArr.push(getTotalTime(2*i+1));
    }
    // console.log(data);
  };


  
  const options2 = {
    // title: "Energy Usage",
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
      {fetchDataOfDevices}
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
              <span>Total Energy Consumed(%)</span>
            </div>
            <div className="components">
              {/* <Pie options={pieOptions} data={pieData} /> */}
              <Chart
                chartType="PieChart"
                data={data}
                options={options2}
                width={"100%"}
                height={"100%"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
