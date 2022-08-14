import handler from "../../../pages/api/watchlist/update_watchlist";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test update_watchlist.ts", () => {

    test("When updating user's watchlist passes", async () => {
        // 1. mock the data
        const createMany_result = {
            "count": 5
        }

        const app_result = {
            "message": "Updated test123's stock watchlist",
            "result": createMany_result
        }

        prisma.stock_Watchlist.createMany = jest.fn().mockReturnValueOnce(createMany_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "user_id" : "test123",
                "stocks"  : [1,2,3,4,5]
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

    test("When updating user's watchlist with valid stocklist but fails expecting error", async () => {
        // 1. mock the data
        const createMany_result = {
            "message" : "mocked error"
        }

        prisma.stock_Watchlist.createMany = jest.fn().mockRejectedValueOnce(createMany_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "user_id" : "test123",
                "stocks"  : [1,2,3,4,5]
            } 
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(createMany_result);
    });

    test("When omitting user_id and list of stocks from POST request expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({method: 'POST'});

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message" : "Specify the user_id and list of stocks."});
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