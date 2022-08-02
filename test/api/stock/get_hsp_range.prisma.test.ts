import handler from "../../../pages/api/stock/get_hsp_range";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_hsp_range.ts", () => {

    test("When getting stock HSP range passes", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const hsp_aggregate_result = {
            "_max": {
              "Date": "2022-08-01T00:00:00.000Z"
            },
            "_min": {
              "Date": "2017-06-13T00:00:00.000Z"
            }
          }
        
        const app_result = {
            "message" : `Found the HSP range for ${ticker_symbol}`,
            "results"  : hsp_aggregate_result 
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.historical_Stock_Price.aggregate = jest.fn().mockReturnValueOnce(hsp_aggregate_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
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

    test("Getting Stock HSP with invalid ticker symbol not in database expecting error", async () => {
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

    test("When getting stock HSP range with valid ticker symbol but fails expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const errorMsg = {
            "message" : "mocked error"
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.historical_Stock_Price.aggregate = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol
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