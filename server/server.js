const express = require("express");
const app = express();
const { Board, Led, Hygrometer, Thermometer, Sensor } = require("johnny-five");
const board = new Board();
var isReady = false;
board.on("ready", () => {
    isReady = true;
});

app.get("/getData", (req, res) => {
    if(isReady) {
        const sensor = new Sensor({
            pin:10,
            type:"digital"
        });
        sensor.on("change", function(res) {
            console.log(res);
        });
        res.json("Done");
    } else {
        res.json("Board not ready");
    }
    
    // res.json(0);
});

app.get("/ledon", (req, res) => {
    if(isReady) {
        console.log(parseInt(req.query['pin']));
        const led = new Led(parseInt(req.query['pin']));
        led.on();
        res.json("Done");
    } else {
        res.json("Board not ready");
    }
});

app.get("/ledoff", (req, res) => {
    if(isReady) {
        console.log(parseInt(req.query['pin']));
        const led = new Led(parseInt(req.query['pin']));
        led.off();
        res.json("Done");
    } else {
        res.json("Board not ready");
    }
});

app.get("/hum", (req, res) => {
    if(isReady) {
        var hygrometer = new Hygrometer({
            controller: "DHT11_I2C_NANO_BACKPACK"
        });
        
        hygrometer.on("change", function() {
            console.log("Hygrometer");
            console.log("  relative humidity : ", this.relativeHumidity);
            res.json(this.relativeHumidity);
        });
    } else {
        res.json("Board not ready");
    }
});

app.get("/temp", (req, res) => {
    if(isReady) {
        const thermometer = new Thermometer({
            controller: "DHT11_I2C_NANO_BACKPACK"
        });
        
        thermometer.on("change", () => {
            const {celsius, fahrenheit, kelvin} = thermometer;
            console.log("Thermometer");
            console.log("  celsius      : ", celsius);
            console.log("  fahrenheit   : ", fahrenheit);
            console.log("  kelvin       : ", kelvin);
            res.json(celsius);
        });
    } else {
        res.json("Board not ready");
    }
})

app.listen(5000, () => console.log("server started, listening on port 5000"));