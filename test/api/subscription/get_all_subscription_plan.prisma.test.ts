import handler from "../../../pages/api/subscription/get_all_subscription_plan";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_all_subscription_plan.ts", () => {

    test("When getting all subscription plans passes", async () => {
        // 1. mock the data
        const find_all_plans = [
            {
                "subscriptionPlanID": 4,
                "planName": "Basic",
                "price": 0,
                "watchlistLimit": 3,
                "Subscription": [
                    {
                        "subscriptionID": 6,
                        "userID": "cl5o4acxd0255xstute3dqxne",
                        "subscriptionPlanID": 4
                    }
                ]
            },
            {
                "subscriptionPlanID": 5,
                "planName": "Pro",
                "price": 59,
                "watchlistLimit": 12,
                "Subscription": []
            },
            {
                "subscriptionPlanID": 6,
                "planName": "Full Access",
                "price": 99,
                "watchlistLimit": 100,
                "Subscription": [
                    {
                        "subscriptionID": 3,
                        "userID": "cl5kx0w9y0004ysv692x34doo",
                        "subscriptionPlanID": 6
                    },
                    {
                        "subscriptionID": 5,
                        "userID": "cl53o3lkr000409mk6q3vyqxg",
                        "subscriptionPlanID": 6
                    }
                ]
            }
        ]
        
        const app_result = {
            "message": "Found 3 plans",
            "result": [
                {
                    "subscriptionPlanID": 4,
                    "planName": "Basic",
                    "price": 0,
                    "watchlistLimit": 3,
                    "Subscription": [
                        {
                            "subscriptionID": 6,
                            "userID": "cl5o4acxd0255xstute3dqxne",
                            "subscriptionPlanID": 4
                        }
                    ],
                    "numberOfSubscribers": 1
                },
                {
                    "subscriptionPlanID": 5,
                    "planName": "Pro",
                    "price": 59,
                    "watchlistLimit": 12,
                    "Subscription": [],
                    "numberOfSubscribers": 0
                },
                {
                    "subscriptionPlanID": 6,
                    "planName": "Full Access",
                    "price": 99,
                    "watchlistLimit": 100,
                    "Subscription": [
                        {
                            "subscriptionID": 3,
                            "userID": "cl5kx0w9y0004ysv692x34doo",
                            "subscriptionPlanID": 6
                        },
                        {
                            "subscriptionID": 5,
                            "userID": "cl53o3lkr000409mk6q3vyqxg",
                            "subscriptionPlanID": 6
                        }
                    ],
                    "numberOfSubscribers": 2
                }
            ]
        }

        prisma.subscription_Plan.findMany = jest.fn().mockReturnValueOnce(find_all_plans);

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

    test("When getting all subscription plans fails", async () => {
        // 1. mock the data
        const error = {
            "message": "mocked error"
        };

        prisma.subscription_Plan.findMany = jest.fn().mockRejectedValueOnce(error);

        // 2. input api call
        const {req, res} = createMocks({method: 'GET'});

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(error);
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

});