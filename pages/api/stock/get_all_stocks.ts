import prisma from '../../../config/prisma';

export default async (req, res) => {

    if (req.method === "GET"){

        try{
            const all_stocks = await prisma.stock.findMany({
                include:{
                    historicalStockPrice:{
                        orderBy : {
                            Date:'desc'
                        },
                        select: {
                            Close:true
                        },
                        take:2
                    }
                }
            });

            var price_list, todays_price, yesterdays_price, difference, pctchange;

            all_stocks.forEach(e=>{
                price_list = e.historicalStockPrice;
                todays_price = price_list[0]['Close'];
                yesterdays_price = price_list[1]['Close'];
                difference = todays_price - yesterdays_price;

                pctchange = (Math.abs(yesterdays_price - todays_price))/yesterdays_price * 100;

                e['latestPrice'] = todays_price;
                e['priceChange'] = difference;
                e['percentChange'] = pctchange;
                delete e.historicalStockPrice;

            })

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