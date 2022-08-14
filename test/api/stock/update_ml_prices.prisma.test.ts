import handler from "../../../pages/api/stock/update_ml_prices";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test update_ml_prices.ts", () => {

    test("When updating stock ML predictions passes", async () => {
        // 1. mock the data

        const ticker_symbol = "TEST";
        const model_type = "1";
        const prediction = [ 
            {"epoch_time" : 10123132345, "price" : 123.45, "confidence_score" : 95.01, "rate_of_error": 3.45},
            {"epoch_time" : 10123133456, "price" : 124.56, "confidence_score" : 90.02, "rate_of_error": 4.56},
            {"epoch_time" : 10123135678, "price" : 125.67, "confidence_score" : 85.03, "rate_of_error": 5.67}
        ];
        
        const findfirst_stock_result = {
            "stockID" : "4"
        }

        const deletemany_ml_stock_price_result = {
            "count" : 3
        }

        const formatted_results = [
            {"stockID" : 4, "Date" : new Date(10123132345), "DateString":"22-MAY-2022", "Price" : 123.45, "Confidence" : 95.01, "Error" : 3.45, "MLModelID" : 1},
            {"stockID" : 4, "Date" : new Date(10123133456), "DateString":"23-MAY-2022", "Price" : 124.56, "Confidence" : 90.02, "Error" : 4.56, "MLModelID" : 1},
            {"stockID" : 4, "Date" : new Date(10123135678), "DateString":"24-MAY-2022", "Price" : 125.67, "Confidence" : 85.03, "Error" : 5.67, "MLModelID" : 1}
        ]

        const createmany_ml_stock_price_result = {
            "count" : 3
        }

        const app_result = {
            "message":`Updated ${createmany_ml_stock_price_result.count} records from Model ${model_type} for ${ticker_symbol}`,
            "result":createmany_ml_stock_price_result
        }

        prisma.stock.findFirst = jest.fn().mockReturnValueOnce(findfirst_stock_result);
        prisma.mL_Stock_Price.createMany = jest.fn().mockReturnValueOnce(createmany_ml_stock_price_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "ticker_symbol" : ticker_symbol,
                "model_type" : model_type,
                "prediction" : prediction
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

    test("When updating stock ML prices with valid ticker symbol but invalid model type fails expecting error", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST"

        const errorMsg = {
            "message" : "Input model_type must be integer"
        }

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

    test("When updating stock ML predictions with invalid ticker symbol not in database expecting error", async () => {
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
        expect(res_output).toEqual(app_result);
    });

    test("When updating stock ML predictions with valid ticker symbol but creating records fails expecting error", async () => {
        // 1. mock the data

        const ticker_symbol = "TEST";
        const model_type = "1";
        const prediction = [ 
            {"epoch_time" : 10123132345, "price" : 123.45, "confidence_score" : 95.01, "rate_of_error": 3.45},
            {"epoch_time" : 10123133456, "price" : 124.56, "confidence_score" : 90.02, "rate_of_error": 4.56},
            {"epoch_time" : 10123135678, "price" : 125.67, "confidence_score" : 85.03, "rate_of_error": 5.67}
        ];
        
        const findfirst_stock_result = {
            "stockID" : "4"
        }

        const errorMsg = {
            "message" : "mocked error"
        }

        prisma.stock.findFirst = jest.fn().mockReturnValueOnce(findfirst_stock_result);
        prisma.mL_Stock_Price.createMany = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "ticker_symbol" : ticker_symbol,
                "model_type" : model_type,
                "prediction" : prediction
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
