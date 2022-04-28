import React, { useEffect, useState } from "react";
import { getNRooms, getTotalTime } from "../Web3Client";
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
    },
  };

  const [labels, setLabels] = useState([]);
  const [nRooms, setNRooms] = useState(0);

  useEffect(() => {
    getNRooms().then((res) => {
      let n = parseInt(res);
      setNRooms(n);
      let lab = []
      for (let i=1; i<=n; i++) {
        lab.push(`Room${i}`);
      }
      console.log("Labels: ",lab);
      setLabels(lab);
      fetchDataOfDevices();
    })
  }, []);

  // const labels = ["Room1", "Room2", "Room3", "Room4"];

  const [barData, setBarData] = useState({
    labels,
    datasets: [
      {
        label: "Fan",
        data: [], // fetch the data of fan
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Light",
        data: [], // fetch the data of lights
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });

  const [data, setData] = useState([
    ["Rooms", "Usage"],
  ]);

  const fetchDataOfDevices = () => {
    let fanArr = [],
      lightArr = [],
      pieArr = [];
    // let total = 0;
    for (let i = 1; i <= nRooms; i++) {
      
      getTotalTime(2 * i).then((res) => {
        console.log(`Fan ${i} : ${res}`);
        fanArr.push(fanVoltage * fanCurrent * parseInt(res));
      });
      getTotalTime(2 * i + 1).then((res) => {
        console.log(`Light ${i} : ${res}`);
        lightArr.push(parseFloat(lightVoltage * lightCurrent * parseInt(res)));
        pieArr.push(parseFloat(lightArr[i - 1] + fanArr[i - 1]));
        if (i === nRooms) {
          for (let i = 0; i < nRooms; i++) {
            fanArr[i] = parseFloat(fanArr[i] / 3600);
            lightArr[i] = parseFloat(lightArr[i] / 3600);
            pieArr[i] = parseFloat(pieArr[i] / 3600);
          }
          let lst = [["Rooms", "Usage (in kWh)"]]
          for (let i = 0; i < nRooms; i++) {
            let val = [`Room${i+1}`, pieArr[i]];
            lst.push(val);
          }
          console.log(lst);
          setData(lst);
          // setData([
          //   ["Rooms", "Usage (in kWh)"],
          //   ["Room 1", pieArr[0]],
          //   ["Room 2", pieArr[1]],
          //   ["Room 3", pieArr[2]],
          //   ["Room 4", pieArr[3]],
          // ])
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
        }
      });
    }
  };


  
  const options2 = {
    // title: "Energy Usage",
  };
  
  return (
    <div className="App">
      {/* {fetchDataOfDevices} */}
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
