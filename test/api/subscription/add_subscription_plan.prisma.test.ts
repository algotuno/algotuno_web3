import handler from "../../../pages/api/subscription/add_subscription_plan";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test add_subscription_plan.ts", () => {

    test("Add Subscription plan with valid inputs expecting success", async () => {
        // 1. mock the data

        const planName = "testplan";
        const price = 10;
        const watchlistLimit = 15;

        const create_plan_result = {
            "subscriptionPlanID": 7,
            "plan_name": planName,
            "price": price,
            "watchlist_limit": watchlistLimit
        }

        const app_result = {
            "message" : `Inserted new plan ${planName}, ${price}, ${watchlistLimit}`,
            "result"  : create_plan_result
        }

        prisma.subscription_Plan.create = jest.fn().mockReturnValueOnce(create_plan_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "plan_name"  : planName,
                "price"      : price,
                "watchlist_limit" : watchlistLimit
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

    test("Add Subscription plan omitting inputs expecting error", async () => {
        
        const error = {
            "message" : "Specify the plan_name, price and watchlist_limit"
        }
        
        // 1. input api call
        const {req, res} = createMocks({
            method: 'POST'
        });

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(error);
    });

    test("Add Subscription plan with valid inputs but failing expecting error", async () => {
        // 1. mock the data

        const planName = "testplan";
        const price = 10;
        const watchlistLimit = 15;

        const create_plan_result = {
            "message" : "mocked error"
        }

        prisma.subscription_Plan.create = jest.fn().mockRejectedValueOnce(create_plan_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "plan_name"  : planName,
                "price"      : price,
                "watchlist_limit" : watchlistLimit
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(create_plan_result);
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