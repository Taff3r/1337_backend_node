"use strict";
const expect = require("chai").expect;
const axios = require("axios");

const server = "http://localhost:1337";

describe("When using /api/coworker/{id}", () => {
    const endpoint = (id) => server + "/api/coworker/" + id;

    let instance;
    before((done) => {
        axios
            .post(server + "/api/login", { username: "testCoworkers" })
            .then((response) => {
                instance = axios.create({
                    baseUrl: server,
                    headers: {
                        common: {
                            Authorization: "Bearer " + response.data,
                        },
                    },
                });
                done();
            });
    });

    describe("While requesting a coworker it", () => {
        it("will get a coworker with the correct id", (done) => {
            instance.get(endpoint(1)).then((response) => {
                expect(response.status).to.be.equal(200);
                expect(response.data).to.have.property("name");
                expect(response.data).to.have.property("text");
                expect(response.data).to.have.property("imagePortraitUrl");
                done();
            });
        });
        it("will not find a coworker with an id that doesn't exist", (done) => {
            instance.get(endpoint(1337)).catch((error) => {
                expect(error.response.status).to.be.equal(404);
                done();
            });
        });

        it("will not find a coworker with an id that is less than 1", (done) => {
            instance.get(endpoint(0)).catch((error) => {
                expect(error.response.status).to.be.equal(400);
                done();
            });
        });

        it("will require an id", (done) => {
            instance.get(endpoint("")).catch((error) => {
                expect(error.response.status).to.be.equal(404);
                done();
            });
        });
    });
});
