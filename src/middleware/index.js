"use strict";
/**
 * Export a function which loads all the middleware that is used in the application.
 * @returns an array with all the loaded middleware.
 */
module.exports = () => {
    return [
        // Built-in middleware
        require("express").json(),

        // 3rd Party middleware
        require("cors")({ origin: "https://backend-assignment.1337co.de" }),

        // Local middleware
        require("./auth.middleware"),
    ];
};
