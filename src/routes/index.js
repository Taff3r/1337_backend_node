"use strict";
const express = require("express");
const router = express.Router();
const coworkersRoutes = require("./coworkers.routes");
const coworkerRoutes = require("./coworker.routes");
const authRoutes = require("./login.routes");

router.use("/coworkers", coworkersRoutes);
router.use("/coworker", coworkerRoutes);
router.use("/login", authRoutes);

module.exports = router;
