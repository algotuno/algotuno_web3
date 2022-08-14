import handler from "../../../pages/api/superuser/get_one_superuser";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_one_superuser.ts", () => {

    test("When getting one superuser passes", async () => {
        // 1. mock the data
        const user_id = "userid1"

        const user_findfirst_result = {
            "id": "userid1",
            "name": null,
            "email": "someemail@gmail.com",
            "username": "someuser",
            "Superuser": [
                {
                    "superuserID": 25,
                    "userID": "userid1"
                }
            ]
        }

        const app_result = {
            "message": `Retrieved superuser ${user_id}'s details`,
            "result": user_findfirst_result
        }

        prisma.user.findFirst = jest.fn().mockReturnValueOnce(user_findfirst_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET',
            body:{
                "user_id" : user_id
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
    });

    test("When omitting user_id in GET request fails expecting error", async () => {
        // 1. mock the data

        const errorMsg = {"message" : "user_id Null or undefined"}

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET'
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(errorMsg);
    });

    test("When getting one superuser with user_id that is not a superuser expecting error message", async () => {
        // 1. mock the data
        const user_id = "userid1"

        const user_findfirst_result = {
            "id": "userid1",
            "name": null,
            "email": "someemail@gmail.com",
            "username": "someuser",
            "Superuser": []
        }

        const errorMsg = {"message":`${user_id} is not a superuser`}

        prisma.user.findFirst = jest.fn().mockReturnValueOnce(user_findfirst_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET',
            body:{
                "user_id" : user_id
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(errorMsg);
    });

    test("When getting one superuser with invalid user_id fails expecting error", async () => {
        // 1. mock the data
        const user_id = "userid1"

        const errorMsg = {
            "message" : "mocked error"
        }

        prisma.user.findFirst = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET',
            body:{
                "user_id" : user_id
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(errorMsg);
    });
   
    test("When using POST instead of GET expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({method: 'POST'});

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message": `ERROR: ${req.method} method used; this endpoint only accepts GET methods`});
    });


});