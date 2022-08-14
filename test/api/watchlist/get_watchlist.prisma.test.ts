import handler from "../../../pages/api/watchlist/get_watchlist";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_watchlist.ts", () => {

    test("When getting user's watchlist passes", async () => {
        // 1. mock the data
        const app_result = {
            "message": "Found 2 stocks in watchlist",
            "result": [
                {
                    "watchlistID": 18,
                    "userID": "test123",
                    "stockID": 1
                },
                {
                    "watchlistID": 19,
                    "userID": "test123",
                    "stockID": 3
                }
            ]
        }

        prisma.stock_Watchlist.findMany = jest.fn().mockReturnValueOnce(app_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "user_id" : "test123"
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

    test("When getting user's watchlist fails expecting error", async () => {
        // 1. mock the data
        const error = {
            "message": "mocked error"
        };

        prisma.stock_Watchlist.findMany = jest.fn().mockRejectedValueOnce(error);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "user_id" : "id123"
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(error);
    });

    test("When omitting user_id from POST request expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({method: 'POST'});

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message" : "Specify the user_id."});
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