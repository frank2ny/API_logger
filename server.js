const express = require("express");
const chalk = require('chalk');
const fs = require('fs');
const PORT = 5000;
const app = express();

const getActualRequestDurationInMilliseconds = start => {
    const NS_PER_SEC = 1e9; //  convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

let demoLogger = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    let log = `[${chalk.blue(formatted_date)}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
    console.log(log);
    fs.appendFile("request_logs.txt", log + "\n", err => {
        if (err) {
            console.log(err);
        }
    });
    next();
};
app.use(demoLogger);

app.get("/", (req, res) => {
    res.send("This is the home Page");
});
app.get("/about", (req, res) => {
    res.send("This is the About page");
});
app.post("/add", (req, res) => {
    res.send("Post request");
});
app.listen(PORT, () => {
    console.log(`App is listening to port ${PORT}`);
});