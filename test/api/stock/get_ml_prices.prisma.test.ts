import handler from "../../../pages/api/stock/get_ml_prices";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_ml_prices.ts", () => {

    test("When getting stock ML prices passes", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"
        const model_type = 1

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const ml_stock_price_findmany_result = [
            {
              "stockID": 4,
              "Date": "2022-08-02T00:00:00.000Z",
              "DateString": "2-AUG-2022",
              "Price": 160.4686737060547,
              "MLModelID": 1,
              "Confidence": 96.12,
              "Error": 12.7719488425725
            },
            {
              "stockID": 4,
              "Date": "2022-08-08T00:00:00.000Z",
              "DateString": "8-AUG-2022",
              "Price": 159.7528381347656,
              "MLModelID": 1,
              "Confidence": 94.1,
              "Error": 13.78509640500866
            },
            {
              "stockID": 4,
              "Date": "2022-08-31T00:00:00.000Z",
              "DateString": "31-AUG-2022",
              "Price": 159.6774291992188,
              "MLModelID": 1,
              "Confidence": 92.16,
              "Error": 14.73805503581205
            }
          ]
        
        const app_result = {
            "message" : `Found ${ml_stock_price_findmany_result.length} records for ${ticker_symbol}`,
            "results"  : ml_stock_price_findmany_result
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.mL_Stock_Price.findMany = jest.fn().mockReturnValueOnce(ml_stock_price_findmany_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol,
                "model_type" : model_type
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

    test("Getting Stock ML prices with invalid ticker symbol not in database expecting error", async () => {
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

    test("When getting stock ML prices with valid ticker symbol but invalid model type fails expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const errorMsg = {
            "message" : "Input model_type must be integer"
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol,
                "model_type" : "TEST"
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

    test("When getting stock ML prices with valid ticker symbol but fails expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const stock_findfirst_result = {
            "stockID" : 4
        }

        const errorMsg = {
            "message" : "mocked error"
        }

        prisma.stock.findFirst = jest.fn().mockReturnValue(stock_findfirst_result)
        prisma.mL_Stock_Price.findMany = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "ticker_symbol" : ticker_symbol,
                "model_type" : "1"
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