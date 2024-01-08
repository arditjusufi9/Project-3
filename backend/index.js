const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express()
const port = 3000
const router = require('./routers/users');

app.use(express.json());

app.use(cors());
app.use(bodyParser.json())

app.use('/users/products/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.use('/users',router);

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})
