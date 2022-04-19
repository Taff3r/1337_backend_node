"use strict";

const express = require("express");
const controller = require("../controllers/coworker.controller");

const router = express.Router();

router.get("/:id", controller.getCoworker);

module.exports = router;
