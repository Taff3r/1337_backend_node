"use strict";
const express = require("express");
const routes = require("./routes/index.js");
const middleware = require("./middleware/index");
const docs = require("./docs/swagger.docs");
const app = express();

// Load middleware
app.use("/api/", middleware());

// Load routes
app.use("/api/", routes);

// Load docs
app.use(docs);

// Start server on localhost:1337
var server = app.listen(1337, () => {
    const serverInfo = server.address();
    const host = serverInfo.address;
    const port = serverInfo.port;
    console.log("Server started on %s:%s", host, port);
});
