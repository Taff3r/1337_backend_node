"use strict";
const express = require("express");
const router = express.Router();
const coworkersRoutes = require("./coworkers.routes");
const coworkerRoutes = require("./coworker.routes");
const authRoutes = require("./login.routes");

router.use("/api/coworkers", coworkersRoutes);
router.use("/api/coworker", coworkerRoutes);
router.use("/api/login", authRoutes);

module.exports = router;
