import express from 'express';
import Boom from "boom";
import dotenv from 'dotenv';

import auth from './routes/auth';

const app = express();
dotenv.config();

app.use(express.json());

app.use('/auth', auth);

app.use((req, res, next) => {
    return next(Boom.notFound("Not found"));
});

app.use((err, req, res, next) => {
    if (err) {
        if (err.output) {
            return res.status(err.output.statusCode || 500).json(err.output.payload);
        }
    }

    return res.status(500).json(err);
});


app.listen(4000, () => {
    console.log('Server is running on port 4000 -> http://localhost:4000');
});