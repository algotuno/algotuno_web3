import handler from "../../../pages/api/stock/get_all_stocks_with_ml_range";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_all_stocks_with_ml_range.ts", () => {

    test("When getting all stocks with ML range passes", async () => {
        // 1. mock the data
        const stock_findmany_result = [
            {
                "stockID": 4,
                "tickerSymbol": "TEST",
                "companyName": "TEST Inc.",
                "exchange": "NasdaqGS",
                "MLStockPrice": [
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
                      "Date": "2022-08-03T08:00:00.000Z",
                      "DateString": "3-AUG-2022",
                      "Price": 159.85,
                      "MLModelID": 2,
                      "Confidence": 65.09,
                      "Error": 1.33
                    },
                    {
                      "stockID": 4,
                      "Date": "2022-08-08T00:00:00.000Z",
                      "DateString": "8-AUG-2022",
                      "Price": 159.7528381347656,
                      "MLModelID": 1,
                      "Confidence": 94.1,
                      "Error": 13.78509640500866
                    }
                ]
            },
            {
                "stockID": 5,
                "tickerSymbol": "TEST2",
                "companyName": "TEST2 Inc.",
                "exchange": "NasdaqGS",
                "MLStockPrice": [
                    {
                      "stockID": 5,
                      "Date": "2022-08-02T00:00:00.000Z",
                      "DateString": "2-AUG-2022",
                      "Price": 160.4686737060547,
                      "MLModelID": 1,
                      "Confidence": 96.12,
                      "Error": 12.7719488425725
                    },
                    {
                      "stockID": 5,
                      "Date": "2022-08-03T08:00:00.000Z",
                      "DateString": "3-AUG-2022",
                      "Price": 159.85,
                      "MLModelID": 2,
                      "Confidence": 65.09,
                      "Error": 1.33
                    },
                    {
                      "stockID": 5,
                      "Date": "2022-08-08T00:00:00.000Z",
                      "DateString": "8-AUG-2022",
                      "Price": 159.7528381347656,
                      "MLModelID": 1,
                      "Confidence": 94.1,
                      "Error": 13.78509640500866
                    }
                ]
            },
            {
                "stockID": 6,
                "tickerSymbol": "TEST3",
                "companyName": "TEST3 Inc.",
                "exchange": "NasdaqGS",
                "MLStockPrice": []
            }
        ]
        
        const updated_stock_results = [
            {
                "stockID" : 4,
                "tickerSymbol" : "TEST",
                "companyName" : "TEST Inc.",
                "exchange"  : "NasdaqGS",
                "latest_stock_date" : "8-AUG-2022",
                "earliest_stock_date" : "2-AUG-2022"
            },
            {
                "stockID" : 5,
                "tickerSymbol" : "TEST2",
                "companyName" : "TEST2 Inc.",
                "exchange"  : "NasdaqGS",
                "latest_stock_date" : "8-AUG-2022",
                "earliest_stock_date" : "2-AUG-2022"
            },
            {
                "stockID" : 6,
                "tickerSymbol" : "TEST3",
                "companyName" : "TEST3 Inc.",
                "exchange"  : "NasdaqGS",
                "latest_stock_date" : "No ML Predictions Found",
                "earliest_stock_date" : "No ML Predictions Found"
            }
        ]

        const app_result = {
            "message":`Found ${updated_stock_results.length} stocks`,
            "result":updated_stock_results
        }

        prisma.stock.findMany = jest.fn().mockReturnValueOnce(stock_findmany_result);

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

    test("When getting all stocks with ML range fails expecting error", async () => {
        // 1. mock the data
        const errorMsg = {
            "message" : "mocked error"
        }
        
        prisma.stock.findMany = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET'
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(errorMsg);
    });


    test("When using POST instead of GET expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({method: 'POST'});

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message": `ERROR: ${req.method} method used; this endpoint only accepts GET methods`});
    });

})
