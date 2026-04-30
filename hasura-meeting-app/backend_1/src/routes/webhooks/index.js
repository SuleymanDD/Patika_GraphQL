import express from "express";
import Boom from "boom";
import nodemailer from "nodemailer";
import Hasura from "../../clients/hasura";
import moment from "moment";
import axios from "axios";

import { GET_PARTICIPANTS, GET_PARTICIPANTS_BY_APPROVE } from "./queries.js";

const router = express.Router();

const smtpConfig = {
    host: "smtp-relay.brevo.com",
    port: 587,
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

    const schedule_event = {
        type: "create_scheduled_event",
        args:{
            webhook: `{{ACTION_BASE_ENDPOINT}}/webhooks/meeting_reminder`,
            schedule_at: moment(meetings_by_pk.meeting_date).subtract(2, "minutes"),
            payload:{
                meeting_id: meeting.id,
            }
        }
    }

    const add_event = await axios("http://localhost:8080/v1/query", {
        method: "POST",
        data: JSON.stringify(schedule_event),
        headers: {
            "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
    });

    const event_data = add_event.data;

    console.log("event_data:", event_data);

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

router.post("/meeting_reminder", async (req, res, next) => {
    const { meeting_id } = req.body.payload;

    const { meetings_by_pk } = await Hasura.request(GET_PARTICIPANTS_BY_APPROVE, { id: meeting_id })

    const title = meetings_by_pk.title;
    const { email } = meetings_by_pk.user;
    const participants = (meetings_by_pk.participants.map(({ user }) => user.email));
    participants.push(email);

    const mailOptions = {
        from: process.env.EMAIL_SENDER_USER,
        to: participants.toString(),
        subject: `'${title}' adlı toplantı başlamak üzere!`,
        text: `'${title}' adlı toplantı 2dkya başlamak üzere! Lütfen hazırlıklarınızı yapın.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return next(error);
        }

        res.json({ info });
    });    
});

export default router;