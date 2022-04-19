"use strict";

const express = require("express");
const router = express.Router();
const model = require("../models/coworker_model.js");

// Validate that a parameter is a positive integer (0 included)
// @param parameter that should be validated.
// @returns the parsed parameter as an integer, or -1 if the parameter couldn't be parsed as a positive integer
const validateIntegerParameter = (parameter) => {
    const id = parseInt(parameter);
    return isNaN(id) || id < 0 ? -1 : id;
};

/**
 * Validates the pagiation parameters, if they are present
 * @param lower, the queried lower bound
 * @param upper, the queried upper bound
 * @returns a HTTP Status code
 */
const validatePagiation = async (lower, upper) => {
    /* Upper can never be less than lower */
    if (upper < lower) {
        return [400, lower, upper];
    }

    /* One part missing? */
    if ((upper && !lower) || (!upper && lower)) {
        return [400, lower, upper];
    }

    /* Lower out of bound? */
    if (lower > (await model.getNumberOfCoworkers()) || lower < 0) {
        return [404, lower, upper];
    }

    return [200, lower, upper];
};

router.get("/", async (req, res) => {
    console.log("got request to coworkers");
    let responseData;
    // Check if both params are present
    if (req.query.start && req.query.end) {
        const [status, lower, upper] = await validatePagiation(
            req.query.start,
            req.query.end
        );

        if (status !== 200) {
            res.status(status).send();
        }

        const maxLength = await model.getNumberOfCoworkers();
        const upperBound = maxLength < upper ? maxLength : upper;

        responseData = await model.getCoworkerSpan(lower, upperBound);
    } else {
        responseData = await model.getCoworkers();
    }

    const responseJson = {
        data: responseData,
        totalLength: await model.getNumberOfCoworkers(),
    };
    res.status(200).json(responseJson);
});

router.get("/:id", async (req, res) => {
    console.debug("getting coworker w id");
    console.debug(req.params.id);
    const id = validateIntegerParameter(req.params.id);
    if (id >= 1) {
        if (id > (await model.getNumberOfCoworkers())) {
            // Not found
            res.status(404).send();
            return;
        } else {
            res.status(200).json(await model.getCoworker(id));
        }
        return;
    }
    res.status(400);
});

module.exports = router;
