import prisma from '../../../config/prisma';

export default async (req, res) => {

    if (req.method === "GET") {

        if (!req.body.user_id) {
            const errorMsg = "user_id Null or undefined";
            console.error(errorMsg);
            res.status(406).json({"message": errorMsg});
            return
        }

        const userID = req.body.user_id;

        try {
            const superuser_record = await prisma.user.findFirst({
                where:{
                    id : userID
                },
                include:{
                    Superuser:true
                }
            });

            console.log(superuser_record);

            if (superuser_record.Superuser.length>0) {

                delete superuser_record.password;
                delete superuser_record.emailVerified;
                delete superuser_record.image;

                const successMsg = `Retrieved superuser ${userID}'s details`
                console.log(successMsg);
                res.status(200).json({
                    "message":successMsg,
                    "result":superuser_record
                });
    
            } else {
                res.status(406).json({
                    "message":`${userID} is not a superuser`
                });
            }

        } catch (error) {
            const errorMsg = error.message;
            console.error(errorMsg)
            res.status(406).json({"message": errorMsg});
        }

    } else {
        res.status(406).json({"message": `ERROR: ${req.method} method used; this endpoint only accepts GET methods`});
    }


}