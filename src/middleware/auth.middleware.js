"use strict";

const jwtService = require("../services/jwt.service");

/**
 * Gets the correct HTTP Status code on JWT error
 *
 * @param err, the error object
 * @returns the appropriate HTTP status code depending on the error.
 */
const handleJwtError = (err) => {
    const errName = err.name;
    switch (errName) {
        case "TokenExpiredError":
        case "NotBeforeError":
            // I know who you are, but I won't let you in.
            return 403;
        default:
            // I don't know who you are, or other errors.
            return 401;
    }
};
/**
 * Middleware for all requests to /api/*.
 * Checks if a request is on one of the "allowed" paths where authentication is not necessary,
 * otherwise, it checks if the user can be authenticated.
 */
module.exports = (req, res, next) => {
    /*
     * NOTE: The instructions tell that login should happen on /api/login,
     * however in reality the test site acctually tries to access /api/login/
     * (you might want to fix this, since /api/login is not a directory)
     */
    const allowedRoutes = ["/login", "/login/"];

    const requestedRoute = req.path;
    for (let i = 0; i < allowedRoutes.length; ++i) {
        if (allowedRoutes[i] === requestedRoute) {
            return next();
        }
    }

    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        return res.status(401).send("missing bearer token");
    }

    try {
        let valid = jwtService.verifyJwt(token);
        return next();
    } catch (err) {
        const code = handleJwtError(err);
        return res.status(code).send(err.message);
    }
};
