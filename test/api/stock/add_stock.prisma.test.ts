import handler from "../../../pages/api/stock/add_stock";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";
import fetchMock from 'jest-fetch-mock';

describe("Test add_stock.ts", () => {

    fetchMock.enableMocks()

    test("Add stock with valid ticker symbol found in Yahoo! Finance API expecting success", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const yahoo_response = {
            "quoteResponse" : {
                "result" : [
                    {
                        "longName" : "TEST inc.",
                        "fullExchangeName" : "stock exchange"
                    }
                ]
            }
        }

        const create_stock_result = {
            "stockID": 40,
            "tickerSymbol": "TEST",
            "companyName": "TEST inc.",
            "exchange": "stock exchange"
        }

        const app_result = {
            "message": "Inserted stock TEST",
            "result": create_stock_result
        }

        fetchMock.mockResponseOnce(JSON.stringify(yahoo_response))
        prisma.stock.create = jest.fn().mockReturnValueOnce(create_stock_result)

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
        fetchMock.resetMocks() 
    });
    
    test("Add stock with valid ticker symbol found in Yahoo! Finance API but prisma error expecting failure", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const yahoo_response = {
            "quoteResponse" : {
                "result" : [
                    {
                        "longName" : "TEST inc.",
                        "fullExchangeName" : "stock exchange"
                    }
                ]
            }
        }

        const app_result = {
            "message": "mocked error"
        }

        fetchMock.mockResponseOnce(JSON.stringify(yahoo_response))
        prisma.stock.create = jest.fn().mockRejectedValueOnce(app_result)

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
        fetchMock.resetMocks() 
    });

    test("Add stock with invalid ticker symbol not found in Yahoo! Finance expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const yahoo_response = {
            "quoteResponse": {
                "result": [],
                "error": null
            }
        }

        const errorMsg = {
            "message": "Ticker Symbol not found in Yahoo Finance API.",
            "result": ""
        }

        fetchMock.mockResponseOnce(JSON.stringify(yahoo_response))

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
        expect(res_output).toEqual(errorMsg);
        fetchMock.resetMocks() 
    });

    test("Omitting ticker_symbol in POST request expecting error", async () => {
        
        const errorMsg = {
            "message" : "Specify ticker_symbol"
        }
        
        // 1. input api call
        const {req, res} = createMocks({
            method: 'POST'
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
        expect(res_output).toEqual({
            "message" : `ERROR: ${req.method} method used; this endpoint only accepts POST methods`
        });
    });

});