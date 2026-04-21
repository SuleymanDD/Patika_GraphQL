const express = require('express');
const app = express();

app.use(express.json());

app.post('/register', (req, res) => {
    const input = req.body.input.data;
    console.log(input);

    res.json(
        {
            accessToken: "accessToken",
        }
    )
});

app.listen(4000, () => {
    console.log('Server is running on port 4000 -> http://localhost:4000');
});