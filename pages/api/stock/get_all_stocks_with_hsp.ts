import prisma from '../../../config/prisma';

export default async (req, res) => {

    if (req.method === "GET"){

        try{

            const all_stocks = await prisma.stock.findMany({include:{historicalStockPrice:true}});
            let stock_list = [];

            for(let i = 0; i < all_stocks.length; i++){

                const e = all_stocks[i]
                console.log(e.tickerSymbol);

                let min, max;

                const hsp_array = e.historicalStockPrice;
                
                if (hsp_array.length>=1){
                    min = hsp_array[0].DateString;
                    max = hsp_array[hsp_array.length-1].DateString;
                } else {
                    min = "No HSP Found";
                    max = "No HSP Found";
                }
                
                let stock = {};
                stock["stockID"] = e.stockID;
                stock["tickerSymbol"] = e.tickerSymbol;
                stock["companyName"] = e.companyName;
                stock["exchange"] = e.exchange;
                stock["latest_stock_date"] = max;
                stock["earliest_stock_date"] = min;

                stock_list.push(stock);

            }

            res.status(200).json({
                "message":"done",
                "result":stock_list
            })


        } catch (error) {
            const errorMsg = error.message;
            console.error(errorMsg)
            res.status(406).json({"message" : errorMsg});
        }
       
    } else {
        res.status(406).json({"message": `ERROR: ${req.method} method used; this endpoint only accepts GET methods`});
    }

}