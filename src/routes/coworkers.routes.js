"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/coworkers.controller");

router.get("/", controller.getCoworkers);

module.exports = router;
