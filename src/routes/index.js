"use strict";
const express = require("express");
const router = express.Router();
const coworkersRoutes = require("./coworkers.routes");
const coworkerRoutes = require("./coworker.routes");

router.use("/api/coworkers", coworkersRoutes);
router.use("/api/coworker", coworkerRoutes);

module.exports = router;
