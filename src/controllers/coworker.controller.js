"use strict";
const model = require("../models/coworker.model");

// Validate that a parameter is a positive integer (0 included)
// @param parameter that should be validated.
// @returns the parsed parameter as an integer, or -1 if the parameter couldn't be parsed as a positive integer
const validateIntegerParameter = (parameter) => {
    const id = parseInt(parameter);
    return isNaN(id) || id < 0 ? -1 : id;
};

module.exports.getCoworker = async (req, res) => {
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
};
