const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors')
const router = require('./src/router.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.PORT}`);
});

app.use(router);