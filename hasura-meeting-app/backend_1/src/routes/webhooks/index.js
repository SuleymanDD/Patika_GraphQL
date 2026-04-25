import express from "express";
import Boom from "boom";
import nodemailer from "nodemailer";
import Hasura from "../../clients/hasura";

import { GET_PARTICIPANTS } from "./queries.js";

const router = express.Router();

const smtpConfig = {
    host: "mailslurp.mx",
    port: 2465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(smtpConfig);

router.post("/meeting_created", async (req, res, next) => {
    const meeting = req.body.event.data.new;

    const { meetings_by_pk } = await Hasura.request(GET_PARTICIPANTS, { id: meeting.id })

    const title = meeting.title;
    const { fullName } = meetings_by_pk.user;
    const participants = (meetings_by_pk.participants.map(({ user }) => user.email)).toString();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: participants,
        subject: `${fullName} adlı kullanıcı sizi toplantıya davet etti!`,
        text: `Merhaba, ${fullName} adlı kullanıcı sizi ${title} adlı toplantıya davet etti!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return next(error);
        }

        res.json({ info });
    });

});

export default router;