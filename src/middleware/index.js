"use strict";
module.exports = () => {
    return [
        require("express").json(),
        require("cors")({ origin: "https://backend-assignment.1337co.de" }),
        require("./auth.middleware"),
    ];

};
