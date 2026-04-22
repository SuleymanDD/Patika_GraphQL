import express from "express";
import Boom from "boom";
import Hasura from "../../clients/hasura";
import bcrypt from "bcryptjs";
import { registerSchema } from "./validations";
import { IS_USER_EXIST, INSERT_USER } from "./queries";
import { signAccessToken } from "./helpers";
const router = express.Router();


router.post("/register", async(req, res,next) => {
    const input = req.body.input.data;
    input.email = input.email.toLowerCase();

    const { error } = registerSchema.validate(input);

    if(error) {
        return next(Boom.badRequest(error.details[0].message));
    }


    try {
        const isUserExist = await Hasura.request(IS_USER_EXIST, { email: input.email });

        if(isUserExist.users.length > 0) {
            throw Boom.conflict(`User already exists ${input.email}`);
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(input.password, salt);

        const {insert_users_one: user} = await Hasura.request(INSERT_USER, { 
            "input": {
                ...input,
                password: hash
            } 
        });

        const accessToken = await signAccessToken(user);

        res.json({accessToken});
    } catch (error) {
        return next(Boom.badRequest(error));
    }

});


export default router;