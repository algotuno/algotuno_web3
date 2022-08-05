import handler from "../../../pages/api/user/get_user_details";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_user_details.ts", () => {

    test("When getting user's details with user_id passes expecting success", async () => {
        // 1. mock the data
        const app_result = {
            "message": "Query completed successfully",
            "result": {
                "id": "userid123",
                "name": null,
                "email": "test123@mail.com",
                "username": "test123",
                "emailVerified": null,
                "Superuser": [],
                "Subscription": [],
                "Stock_Watchlist": [],
                "User_Settings": []
            }
        }

        prisma.user.findFirst = jest.fn().mockReturnValueOnce(app_result);

        // 2. input api call
        const {req, res} = createMocks({
            method  :   'POST',
            body: {
                'user_id': 'userid123'
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output.result).toEqual(app_result);
    });

    test("When getting user's details with username passes expecting success", async () => {
        // 1. mock the data
        const app_result = {
            "message": "Query completed successfully",
            "result": {
                "id": "userid123",
                "name": null,
                "email": "test123@mail.com",
                "username": "test123",
                "emailVerified": null,
                "Superuser": [],
                "Subscription": [],
                "Stock_Watchlist": [],
                "User_Settings": []
            }
        }

        prisma.user.findFirst = jest.fn().mockReturnValueOnce(app_result);

        // 2. input api call
        const {req, res} = createMocks({
            method  :   'POST',
            body: {
                'username': 'test123'
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output.result).toEqual(app_result);
    });

    test("When getting user's details fails expecting generic error", async () => {
        // 1. mock the data
        const errorMsg = {
            "message": "mocked error"
        };

        prisma.user.findFirst = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method  :   'POST',
            body: {
                'username': 'test123'
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

    test("When omitting user_id and username in POST request expecting error", async () => {
        // 1. mock the data
        const errorMsg = {
            "message": "Specify user_id or username"
        };

        prisma.user.findFirst = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method  :   'POST',
            body: {}
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(errorMsg);
    });

    
    test("When using GET instead of POST expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({method: 'GET'});

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message": `ERROR: ${req.method} method used; this endpoint only accepts POST methods`});
    });

});