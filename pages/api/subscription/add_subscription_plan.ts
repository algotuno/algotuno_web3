import prisma from '../../../config/prisma';

export default async (req, res) => {

    if (req.method === "POST"){

        let query;

        // check if plan_name, price and watchlist_limit are specified
        
        const planName = req.body.plan_name;
        const price = req.body.price;
        const watchlistLimit = req.body.watchlist_limit;

        if (planName && price && watchlistLimit)
        {
            query = {
                "planName"          : req.body.plan_name,
                "price"             : req.body.price,
                "watchlistLimit"    : req.body.watchlist_limit
            }
        } else {
            res.status(406).json({
                "message" : "Specify the plan_name, price and watchlist_limit"
            });
        }

        try{
            const add_plan = await prisma.subscription_Plan.create({data:query});
            const successMsg = `Inserted new plan ${planName}, ${price}, ${watchlistLimit}`;
            console.log(successMsg);
            res.status(200).json({
                "message" : successMsg,
                "result"  : add_plan
            });

        } catch (error) {
            const errorMsg = error.message;
            console.error(errorMsg)
            res.status(406).json({"message" : errorMsg});
        }
       
    } else {
        res.status(406).json({"message": `ERROR: ${req.method} method used; this endpoint only accepts POST methods`});
    }
    

}