"use strict";

const expect = require("chai").expect;
const axios = require("axios");

const server = "http://localhost:1337";

describe("When using the /api/coworkers route", () => {
    const endpoint = server + "/api/coworkers";
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
    describe("While not using query parameters it", () => {
        it("will return all the coworkers", (done) => {
            instance.get(endpoint).then((response) => {
                expect(response.status).to.be.equal(200);
                const responseBody = response.data;

                expect(responseBody).to.have.property("totalLength");
                expect(responseBody).to.have.property("data");

                const data = responseBody.data;
                const len = responseBody.totalLength;
                expect(data.length).to.be.equal(len);

                for (let i = 0; i < len; ++i) {
                    const coworker = data[i];
                    expect(coworker).to.have.property("id");
                    expect(coworker).to.have.property("city");
                    expect(coworker).to.have.property("text");
                    expect(coworker).to.have.property("country");
                    expect(coworker).to.have.property("imageFullUrl");
                    expect(coworker).to.have.property("imagePortraitUrl");
                }
                done();
            });
        });
    });

    describe("while using pagiation it", () => {
        it("can get a range of coworkers", (done) => {
            instance.get(endpoint + "?start=0&end=20").then((response) => {
                expect(response.status).to.be.equal(200);
                expect(response.data.data.length).to.be.equal(20);
                done();
            });
        });

        it("will throw an error if the start parameter is below 0", (done) => {
            instance.get(endpoint + "?start=-1&end=20").catch((error) => {
                expect(error.response.status).to.be.equal(404);
                done();
            });
        });

        it("will return all coworkers when setting end over the maximum number of coworkers", (done) => {
            instance.get(endpoint + "?start=10&end=999").then((response) => {
                expect(response.status).to.be.equal(200);
                const totalLength = response.data.totalLength;
                const coworkers = response.data.data;
                expect(coworkers.length).to.be.equal(totalLength - 10);
                done();
            });
        });

        it("is required that both query parameters are present", (done) => {
            instance.get(endpoint + "?end=20").catch((error) => {
                expect(error.response.status).to.be.equal(400);
                done();
            });
        });
    });
});
