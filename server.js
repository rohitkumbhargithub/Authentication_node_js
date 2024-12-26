const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieparser = require('cookie-parser');
const port = 3000;
const bodyparser = require('body-parser');
const db = require('./db/mongoose.js');
const authRoutes = require('./routes/authRoute.js');
const authMiddleware = require("./middleware/authMiddleware.js");
const expressLayouts = require('express-ejs-layouts');

const app = express();
dotenv.config();

app.use(express.urlencoded());
app.use(express.static('assets'));
app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
app.use(authMiddleware);

app.use('/', authRoutes);

app.listen(port, (err) => {
    if(err){
        console.log(err);
    }
    db();
    console.log('http://localhost:3000/');
})



