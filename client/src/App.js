import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./components/Home";
import Rooms from "./components/Rooms";
import Charts from "./components/Charts";
import { init } from './Web3Client';
import axios from 'axios';


function App() {

  function getData() {
    axios.get('http://localhost:5000/getData').then((res) => {
      console.log("Satus", res.data);
    });
  }

  useEffect(() => {
    init();
    getData();
  }, []);

  return (
    <div className="App">

      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/rooms" element={<Rooms/>} />
          <Route path="/charts" element={<Charts/>} />
        </Routes>
      </Router>


    </div>
  );
}

export default App;