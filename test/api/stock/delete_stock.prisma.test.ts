import handler from "../../../pages/api/stock/delete_stock";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test delete_stock.ts", () => {

    test("Delete Stock with valid ticker symbol expecting success", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST";

        const findfirst_stock_result = {
            "stockID": 6,
            "tickerSymbol": "TEST",
            "companyName": "TEST inc.",
            "exchange": "TEST"
        };

        const delete_stock_result = {
            "count": 1
        };

        const app_result = {
            "message" : `Deleted stock ${ticker_symbol}`,
            "result" : delete_stock_result
        }
        
        prisma.stock.findFirst = jest.fn().mockReturnValueOnce(findfirst_stock_result);
        prisma.stock.deleteMany = jest.fn().mockReturnValueOnce(delete_stock_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "ticker_symbol" : ticker_symbol
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

    test("Delete Stock with invalid ticker symbol not in database expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST";

        const findfirst_stock_result = null;

        const app_result = {
            "message" : `Stock ${ticker_symbol} does not exist`
        }
        
        prisma.stock.findFirst = jest.fn().mockReturnValueOnce(findfirst_stock_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "ticker_symbol" : ticker_symbol
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
    });

    test("Delete Stock with valid ticker symbol expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST";

        const app_result = {
            "message" : "mocked error"
        }
        
        prisma.stock.findFirst = jest.fn().mockRejectedValueOnce(app_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "ticker_symbol" : ticker_symbol
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
    });

    test("When omitting ticker_symbol in POST request expecting error", async () => {
        // 1. mock the data
        const app_result = {
            "message" : "mocked error"
        }
        
        prisma.stock.findFirst = jest.fn().mockRejectedValueOnce(app_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST'
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
    });


    test("When using GET instead of POST expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({
            method: 'GET'
        });

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({
            "message" : `ERROR: ${req.method} method used; this endpoint only accepts POST methods`
        });
    });

});