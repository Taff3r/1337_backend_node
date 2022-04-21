"use strict";
const model = require("../models/coworker.model");

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

module.exports.getCoworkers = async (req, res) => {
    let responseData;
    // Check if both params are present
    if (req.query.start && req.query.end) {
        const [status, lower, upper] = await validatePagiation(
            req.query.start,
            req.query.end
        );

        if (status !== 200) {
            return res.status(status).send();
        }

        const maxLength = await model.getNumberOfCoworkers();
        const upperBound = maxLength < upper ? maxLength : upper;

        responseData = await model.getCoworkerSpan(lower, upperBound);

        // Only one query parameter is used since both are not
    } else if (req.query.start || req.query.end) {
        return res.status(400).send();
    } else {
        responseData = await model.getCoworkers();
        /* Check only one present */
    }

    const responseJson = {
        data: responseData,
        totalLength: await model.getNumberOfCoworkers(),
    };
    return res.status(200).json(responseJson);
};
