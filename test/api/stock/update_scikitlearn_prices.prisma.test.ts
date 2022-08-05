import handler from "../../../pages/api/stock/update_scikitlearn_prices";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";
import fetchMock from 'jest-fetch-mock';

describe("Test update_scikitlearn_prices.ts", () => {

    fetchMock.enableMocks()
    
    test("When updating scikitlearn prices passes", async () => {
        // 1. mock the data

        const all_stocks = JSON.stringify([
            {
              "stockID": 4,
              "tickerSymbol": "TEST1",
              "companyName": "TEST Inc.",
              "exchange": "NasdaqGS"
            },
            {
              "stockID": 6,
              "tickerSymbol": "TEST2",
              "companyName": "TEST2 pte ltd",
              "exchange": "NYSE"
            }
        ]);
        
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

        fetchMock.mockResponseOnce(JSON.stringify(all_stocks));
        fetchMock.resetMocks() 

        console.log(all_stocks);

        // prisma.stock.findFirst = jest.fn().mockReturnValueOnce(findfirst_stock_result);
        // prisma.mL_Stock_Price.createMany = jest.fn().mockReturnValueOnce(createmany_ml_stock_price_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET'
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
    });

});
