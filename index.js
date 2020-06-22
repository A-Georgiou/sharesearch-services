const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv/config');

const app = express();

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Connect DB
mongoose.connect(
    process.env.DB_CONNECTION, {
        useNewUrlParser: true
    },
    () => console.log('New DB Connection Secured.'));

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [`${process.env.FRONT_URL}`, 'http://localhost:8000'],
    credentials: true
}));


//Routing Middleware
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute);

//Listen on port 3000
app.listen(3000, () => console.log('authentication server running at port 3000...'));