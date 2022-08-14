import handler from "../../../pages/api/stock/get_hsp";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_hsp.ts", () => {

    test("When getting stock HSP with no input dates passes", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const hsp_findmany_result = [
            {
              "stockID": 4,
              "Date": "2017-07-25T00:00:00.000Z",
              "DateString": "25-JUL-2017",
              "Open": 125.739998,
              "High": 126.309998,
              "Low": 125.650002,
              "Close": 126.110001,
              "Volume": 37900
            },
            {
              "stockID": 4,
              "Date": "2017-07-26T00:00:00.000Z",
              "DateString": "26-JUL-2017",
              "Open": 126.059998,
              "High": 126.059998,
              "Low": 125,
              "Close": 125.169998,
              "Volume": 36000
            },
            {
              "stockID": 4,
              "Date": "2017-07-27T00:00:00.000Z",
              "DateString": "27-JUL-2017",
              "Open": 125.419998,
              "High": 125.419998,
              "Low": 124,
              "Close": 124.589996,
              "Volume": 55000
            }
        ]
        
        const app_result = {
            "message" : `Found ${hsp_findmany_result.length} records for ${ticker_symbol}`,
            "results"  : hsp_findmany_result 
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.historical_Stock_Price.findMany = jest.fn().mockReturnValueOnce(hsp_findmany_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol,
                "sort"  :   "asc"
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

    test("When getting stock HSP with valid start/end dates passes", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const hsp_findmany_result = [
            {
              "stockID": 4,
              "Date": "2017-07-25T00:00:00.000Z",
              "DateString": "25-JUL-2017",
              "Open": 125.739998,
              "High": 126.309998,
              "Low": 125.650002,
              "Close": 126.110001,
              "Volume": 37900
            },
            {
              "stockID": 4,
              "Date": "2017-07-26T00:00:00.000Z",
              "DateString": "26-JUL-2017",
              "Open": 126.059998,
              "High": 126.059998,
              "Low": 125,
              "Close": 125.169998,
              "Volume": 36000
            },
            {
              "stockID": 4,
              "Date": "2017-07-27T00:00:00.000Z",
              "DateString": "27-JUL-2017",
              "Open": 125.419998,
              "High": 125.419998,
              "Low": 124,
              "Close": 124.589996,
              "Volume": 55000
            }
        ]
        
        const app_result = {
            "message" : `Found ${hsp_findmany_result.length} records for ${ticker_symbol}`,
            "results"  : hsp_findmany_result 
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.historical_Stock_Price.findMany = jest.fn().mockReturnValueOnce(hsp_findmany_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol,
                "start_date"	:	"2017-07-25",
                "end_date"	    :	"2017-07-27",
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

    test("When getting stock HSP with only valid start date passes", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const hsp_findmany_result = [
            {
              "stockID": 4,
              "Date": "2017-07-25T00:00:00.000Z",
              "DateString": "25-JUL-2017",
              "Open": 125.739998,
              "High": 126.309998,
              "Low": 125.650002,
              "Close": 126.110001,
              "Volume": 37900
            },
            {
              "stockID": 4,
              "Date": "2017-07-26T00:00:00.000Z",
              "DateString": "26-JUL-2017",
              "Open": 126.059998,
              "High": 126.059998,
              "Low": 125,
              "Close": 125.169998,
              "Volume": 36000
            },
            {
              "stockID": 4,
              "Date": "2017-07-27T00:00:00.000Z",
              "DateString": "27-JUL-2017",
              "Open": 125.419998,
              "High": 125.419998,
              "Low": 124,
              "Close": 124.589996,
              "Volume": 55000
            }
        ]
        
        const app_result = {
            "message" : `Found ${hsp_findmany_result.length} records for ${ticker_symbol}`,
            "results"  : hsp_findmany_result 
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.historical_Stock_Price.findMany = jest.fn().mockReturnValueOnce(hsp_findmany_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol,
                "start_date"	:	"2017-07-25",
                "end_date"	    :	"TESTDATE",
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

    test("When getting stock HSP with only valid end date passes", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const hsp_findmany_result = [
            {
              "stockID": 4,
              "Date": "2017-07-25T00:00:00.000Z",
              "DateString": "25-JUL-2017",
              "Open": 125.739998,
              "High": 126.309998,
              "Low": 125.650002,
              "Close": 126.110001,
              "Volume": 37900
            },
            {
              "stockID": 4,
              "Date": "2017-07-26T00:00:00.000Z",
              "DateString": "26-JUL-2017",
              "Open": 126.059998,
              "High": 126.059998,
              "Low": 125,
              "Close": 125.169998,
              "Volume": 36000
            },
            {
              "stockID": 4,
              "Date": "2017-07-27T00:00:00.000Z",
              "DateString": "27-JUL-2017",
              "Open": 125.419998,
              "High": 125.419998,
              "Low": 124,
              "Close": 124.589996,
              "Volume": 55000
            }
        ]
        
        const app_result = {
            "message" : `Found ${hsp_findmany_result.length} records for ${ticker_symbol}`,
            "results"  : hsp_findmany_result 
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.historical_Stock_Price.findMany = jest.fn().mockReturnValueOnce(hsp_findmany_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol,
                "start_date"	:	"TESTDATE",
                "end_date"	    :	"2017-07-27",
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

    test("When getting stock HSP with no input dates and invalid sorting passes", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const hsp_findmany_result = [
            {
              "stockID": 4,
              "Date": "2017-07-25T00:00:00.000Z",
              "DateString": "25-JUL-2017",
              "Open": 125.739998,
              "High": 126.309998,
              "Low": 125.650002,
              "Close": 126.110001,
              "Volume": 37900
            },
            {
              "stockID": 4,
              "Date": "2017-07-26T00:00:00.000Z",
              "DateString": "26-JUL-2017",
              "Open": 126.059998,
              "High": 126.059998,
              "Low": 125,
              "Close": 125.169998,
              "Volume": 36000
            },
            {
              "stockID": 4,
              "Date": "2017-07-27T00:00:00.000Z",
              "DateString": "27-JUL-2017",
              "Open": 125.419998,
              "High": 125.419998,
              "Low": 124,
              "Close": 124.589996,
              "Volume": 55000
            }
        ]
        
        const app_result = {
            "message" : `Found ${hsp_findmany_result.length} records for ${ticker_symbol}`,
            "results"  : hsp_findmany_result 
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.historical_Stock_Price.findMany = jest.fn().mockReturnValueOnce(hsp_findmany_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol,
                "sort" : "TESTSORT"
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
    
    test("When getting stock HSP with no input dates fails expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const errorMsg = {
            "message" : "mocked error"
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.historical_Stock_Price.findMany = jest.fn().mockRejectedValueOnce(errorMsg);

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