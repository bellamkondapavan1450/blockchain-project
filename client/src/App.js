import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./components/Home";
import Rooms from "./components/Rooms";
import { init } from './Web3Client';


function App() {

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">

      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/rooms" element={<Rooms/>} />
        </Routes>
      </Router>


    </div>
  );
}

export default App;