"use strict";

const expect = require("chai").expect;
const axios = require("axios");

const server = "http://localhost:1337";

describe("The JWT Authentication", () => {
    const loginUrl = server + "/api/login";

    describe("When logging in", () => {
        it("requires a username", (done) => {
            axios.post(loginUrl).catch((error) => {
                expect(error.response.status).to.be.equal(400);
                done();
            });
        });
        it("will sign a username", (done) => {
            axios.post(loginUrl, { username: "test" }).then((response) => {
                expect(response.status).to.be.equal(200);
                expect(response.headers["content-type"]).to.be.equal("plain/text; charset=utf-8");
                done();
            });
        });
    });

    describe("When trying to access a protected resource", () => {
        const exampleResource = server + "/api/coworkers";
        it("will reject a request if a token is missing", (done) => {
            axios.get(exampleResource).catch((error) => {
                expect(error.response.status).to.be.equal(401);
                expect(error.response.data).to.be.equal("missing bearer token");
                done();
            });
        });
        it("will reject an expired token", (done) => {
            const expiredToken 
                = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoic3RyaW5nIn0sImV4cCI6MTY1MDQ2NzMwMCwiaWF0IjoxNjUwNDYwMTAwfQ.Zd2FUcKrgIH2Vgvw_5MMMOWTMlJ2pF5dSwcWzdoaJZ0";
            const config = {
                headers: {
                    Authorization: "Bearer " + expiredToken,
                },
            };

            axios.get(exampleResource, config).catch((error) => {
                expect(error.response.status).to.be.equal(403);
                expect(error.response.data).to.be.equal("jwt expired");
                done();
            });
        });

        it("will accept a valid token", (done) => {
            const config = {
                headers: {
                    Authorization: "",
                },
            };

            axios
                .post(loginUrl, { username: "validTest" })
                .then((response) => {
                    config.headers.Authorization = "Bearer " + response.data;
                })
                .then(() => {
                    axios.get(exampleResource, config).then((response) => {
                        expect(response.status).to.be.equal(200);
                        done();
                    });
                });
        });

        it("will reject a token signed with the wrong key", (done) => {
            const jwt = require("jsonwebtoken");

            const invalidToken = jwt.sign(
                { data: { username: "validTest" } },
                "somekey"
            );

            const config = {
                headers: {
                    Authorization: "Bearer " + invalidToken,
                },
            };

            axios.get(exampleResource, config).catch((error) => {
                expect(error.response.status).to.be.equal(401);
                done();
            });
        });
    });
});
