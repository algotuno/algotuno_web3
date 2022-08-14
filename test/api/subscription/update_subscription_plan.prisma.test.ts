import handler from "../../../pages/api/subscription/update_subscription_plan";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test update_subscription_plan.ts", () => {

    test("When updating a subscription plans with all valid inputs passes", async () => {
        // 1. mock the data

        const subscriptionPlanID = 8;
        const planName = "newplanname";
        const price = 50;
        const watchlistLimit = 50;

        const update_plan_results = {
            "subscriptionPlanID": 8,
            "planName": "asd",
            "price": 50,
            "watchlistLimit": 50
        }

        const app_result = {
            "message" : `Successfully updated subscription plan ${subscriptionPlanID}'s details`,
            "result" : update_plan_results
        }
     
        prisma.subscription_Plan.update = jest.fn().mockReturnValueOnce(update_plan_results);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "subscription_plan_id" : subscriptionPlanID,
                "plan_name" : planName,
                "price"     : price,
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

    test("When updating a subscription plan with invalid subscription_plan_id fails expecting P2025 error", async () => {
        // 1. mock the data
        const subscriptionPlanID = 8;
        const plan_name = "testplan"

        const errorMsg = {
            "code" : "P2025",
            "message" : "Failed to update subscription plan; record not found"
        }

        prisma.subscription_Plan.update = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "subscription_plan_id": subscriptionPlanID,
                "plan_name" : plan_name
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output.message).toEqual(errorMsg.message);
    });

    test("When updating a subscription plan with valid inputs fail expecting generic error", async () => {
        // 1. mock the data
        const subscriptionPlanID = 8;
        const plan_name = "testplan"

        const errorMsg = {
            "code" : "P202512345",
            "message" : "mocked error"
        }

        prisma.subscription_Plan.update = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "subscription_plan_id": subscriptionPlanID,
                "plan_name" : plan_name
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output.message).toEqual(errorMsg.message);
    });


    test("When updating a subscription plan omitting subscription_plan_id fails expecting error", async () => {
        // 1. mock the data
        const planName = "newplanname";
        const price = 50;
        const watchlistLimit = 50;

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "plan_name" : planName,
                "price"     : price,
                "watchlist_limit" : watchlistLimit
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message" : "Specify the subscription_plan_id"});
    });

    test("When using POST omitting plan_name and price and watchlist_limit expecting error", async () => {
        // 1. input api call
        const subscriptionPlanID = 8;

        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "subscription_plan_id" : subscriptionPlanID
            }
        });

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message" : "Specify the plan_name OR price OR watchlist_limit."});
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