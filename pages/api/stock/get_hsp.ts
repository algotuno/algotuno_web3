import { PrismaClient } from '@prisma/client';

let prisma

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }

  prisma = global.prisma
}

export default async (req, res) => {

    if (req.method === "GET"){

        // check if ticker symbol exists in body
        if(!req.body.ticker_symbol){
            const errorMsg = "ticker_symbol Null or undefined";
            console.error(errorMsg);
            res.status(406).json({"message" : errorMsg});
            return
        }

        var ticker_symbol;


        try{

            // check if ticker symbol exists in Stock database
            ticker_symbol = req.body.ticker_symbol;

            const stock_record = await prisma.stock.findFirst({
                where: {
                    tickerSymbol : ticker_symbol
                }
            });

            // return the corresponding stockID
            const stock_id = stock_record.stockID;

            // return the HSP for the stock
            const all_records = await prisma.historical_Stock_Price.findMany({
                where:{
                    stockID : stock_id
                }
            })

            const successMsg = `Found ${all_records.length} records for ${ticker_symbol}`;
            console.log(successMsg);
            res.status(200).json({
                "message" : successMsg,
                "results" : all_records
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