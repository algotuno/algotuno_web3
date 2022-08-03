import prisma from '../../../config/prisma';

export default async (req, res) => {

    if (req.method === "GET"){

        try{

            const all_stocks = await prisma.stock.findMany({
                include:{
                    MLStockPrice:true
                }
            });

           all_stocks.forEach(e=>{
                const ml_price_list = e.MLStockPrice;

                if(ml_price_list.length>=1){
                    e["latest_stock_date"] = ml_price_list[ml_price_list.length-1]["DateString"];
                    e["earliest_stock_date"] = ml_price_list[0]["DateString"];
                } else {
                    e["latest_stock_date"] = "No ML Predictions Found";
                    e["earliest_stock_date"] = "No ML Predictions Found";
                }

                delete e.MLStockPrice;
           });

           const successMsg = `Found ${all_stocks.length} stocks`;
           console.log(successMsg);
           res.status(200).json({
             "message" : successMsg,
             "result"  : all_stocks 
           });

        } catch (error) {
            const errorMsg = error.message;
            console.error(errorMsg)
            res.status(406).json({"message" : errorMsg});
        }
       
    } else {
        res.status(406).json({"message": `ERROR: ${req.method} method used; this endpoint only accepts GET methods`});
    }

}