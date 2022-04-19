"use strict";
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const routes = require("./routes/index.js");
const app = express();

app.use(cors({ origin: "https://backend-assignment.1337co.de" }));
app.use(routes);

// Start server on localhost:1337
var server = app.listen(1337, () => {
    const serverInfo = server.address();
    const host = serverInfo.address;
    const port = serverInfo.port;
    console.log("Server started on %s:%s", host, port);
});
