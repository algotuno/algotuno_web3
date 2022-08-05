import handler from "../../../pages/api/stock/delete_hsp";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test delete_hsp.ts", () => {

    test("Delete Stock HSP with valid ticker symbol expecting success", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST";

        const findfirst_stock_result = {
            "stockID": 6,
            "tickerSymbol": "TEST",
            "companyName": "TEST inc.",
            "exchange": "TEST"
        };

        const delete_hsp_results = {
            "count": 500
        };

        const app_result = {
            "message" : `Deleted ${delete_hsp_results.count} records for ${ticker_symbol}`
        }
        
        prisma.stock.findFirst = jest.fn().mockReturnValueOnce(findfirst_stock_result);
        prisma.historical_Stock_Price.deleteMany = jest.fn().mockReturnValueOnce(delete_hsp_results);

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

    test("When omitting ticker_symbol in POST request expecting error", async () => {
        // 1. mock the data
        const app_result = {
            "message" : "ticker_symbol Null or undefined"
        }

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

    test("Delete Stock HSP with invalid ticker symbol not in database expecting error", async () => {
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

    test("Delete Stock HSP with valid ticker symbol fails in finding stock in database expecting error", async () => {
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


    test("Delete Stock HSP with valid ticker symbol but fail in deleting HSP expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST";

        const findfirst_stock_result = {
            "stockID": 6,
            "tickerSymbol": "TEST",
            "companyName": "TEST inc.",
            "exchange": "TEST"
        };

        const delete_hsp_results = {
            "message" : "mocked error"
        };
        
        prisma.stock.findFirst = jest.fn().mockReturnValueOnce(findfirst_stock_result);
        prisma.historical_Stock_Price.deleteMany = jest.fn().mockRejectedValueOnce(delete_hsp_results);

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
        expect(res_output).toEqual(delete_hsp_results);
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