const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;
const LOG_PATH = "/data/log.txt";

app.use(bodyParser.text({ type: "*/*" }));

// append the incoming record persistently
app.post("/log", (req, res) => {
    fs.appendFileSync(LOG_PATH, req.body + "\n");
    res.send("Logged");
});

// gets the content of whole stored log
app.get("/log", (req, res) => {
    if (!fs.existsSync(LOG_PATH)) {
        return res.type("text/plain").send("");
    }
    const logs = fs.readFileSync(LOG_PATH, "utf8");
    res.type("text/plain").send(logs);
});

app.listen(PORT, () => console.log(`Storage service running on port ${PORT}`));
