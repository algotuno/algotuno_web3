import prisma from '../../../config/prisma';

export default async (req, res) => {

    if (req.method === "POST") {

        // check if username exists in body
        if (!req.body.username) {
            const errorMsg = "username Null or undefined";
            console.error(errorMsg);
            res.status(406).json({"message": errorMsg});
            return
        }

        let user_id;

        const input_username = req.body.username;

        try{
            const user_record = await prisma.user.findFirst({
                where: {
                    username : input_username
                }
            });

            if (user_record) {
                // return the corresponding user ID
                user_id = user_record.id;
            } else {
                console.log(`User ${input_username} does not exist`)
                return res.status(406).json({
                    "message": `User ${input_username} does not exist`
                });
            }

            const delete_superuser = await prisma.user.delete({
                where: {
                    id : user_id
                }
            })

            const successMsg = `Deleted ${input_username} from User`;
            console.log(successMsg);
            res.status(200).json({
                "message" : successMsg,
                "result" : delete_superuser
            });

        } catch (error) {
            const code = error.code;
            console.error(error.message)
            // error code for record not found
            if (code === 'P2025'){
                res.status(406).json({"message":`Failed to delete ${input_username} from User; ${input_username} is not a User`});
            } else {
                res.status(406).json({"message" : error.message});
            }
            return
        }


    } else {
        res.status(406).json({"message": `ERROR: ${req.method} method used; this endpoint only accepts POST methods`});
    }


}