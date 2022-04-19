"use strict";
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const coworkerController = require("./coworkers/controllers/coworker_controller.js");
const app = express();

app.use(cors({ origin: "https://backend-assignment.1337co.de" }));
app.use("/api/coworkers", coworkerController);
app.use("/api/coworker", coworkerController);

// Start server on localhost:1337
var server = app.listen(1337, () => {
    const serverInfo = server.address();
    const host = serverInfo.address;
    const port = serverInfo.port;
    console.log("Server started on %s:%s", host, port);
});
