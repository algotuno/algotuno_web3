import handler from "../../../pages/api/user/get_all_user";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_all_user.ts", () => {

    test("When getting all users passes", async () => {
        // 1. mock the data
        const app_result = {
            "message": "Found 2 users",
            "result": [
                {
                    "id": "id123",
                    "name": null,
                    "email": "test123@mail.com",
                    "username": "test123",
                    "emailVerified": null,
                    "Superuser": [],
                    "Subscription": [],
                    "Stock_Watchlist": [],
                    "User_Settings": []
                },
                {
                    "id": "id124",
                    "name": null,
                    "email": "123@hotmail.com",
                    "username": "hari",
                    "emailVerified": null,
                    "Superuser": [],
                    "Subscription": [],
                    "Stock_Watchlist": [],
                    "User_Settings": []
                }
            ]
        }

        prisma.user.findMany = jest.fn().mockReturnValueOnce(app_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET',
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output.result).toEqual(app_result);
    });

    test("When getting all users fails expecting error", async () => {
        // 1. mock the data
        const error = {
            "message": "mocked error"
        };

        prisma.user.findMany = jest.fn().mockRejectedValueOnce(error);

        // 2. input api call
        const {req, res} = createMocks({method: 'GET'});

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(error);
    });

    test("When using POST instead of GET", async () => {
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