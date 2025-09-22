const express = require("express");
const os = require("os");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = 3000;
const VSTORAGE_PATH = "/mnt/vstorage/log.txt";
const STORAGE_URL = "http://storage:4000/log";

function getUptimeHours() {
    return (os.uptime() / 3600).toFixed(2);
}

function getFreeDiskMB() {
    const { spawnSync } = require("child_process");
    const df = spawnSync("df", ["--output=avail", "/"]).stdout.toString();
    const lines = df.trim().split("\n");
    const availableBlocks = parseInt(lines[1], 10);
    return (availableBlocks / 1024).toFixed(2);
}

app.get("/status", async (req, res) => {
    const timestamp = new Date().toISOString();
    const record = `Timestamp2: uptime ${getUptimeHours()} hours, free disk in root: ${getFreeDiskMB()} Mbytes at ${timestamp}`;

    try {
        fs.appendFileSync(VSTORAGE_PATH, record + "\n");
        await axios.post(STORAGE_URL, record, { headers: { "Content-Type": "text/plain" } });
        res.type("text/plain").send(record);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send("Error processing request");
    }
});

app.listen(PORT, () => console.log(`Service2 running on port ${PORT}`));
