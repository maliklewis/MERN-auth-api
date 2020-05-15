const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser'); //reading api response data

//db connection
mongoose.connect('mongodb://127.0.0.1:27017/mernauth', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('DB connected'))
.catch(err => console.log('DB connection error: ', err))


//import routes
const authRoutes = require('./routes/auth');

//app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(cors()); //overrides cors errors in the browers *thank god*
if (process.env.NODE_ENV = 'dev') {
    app.use(cors({origin: `http://localhost:3000`})); //react front end port to allow to connect to port 8000
}

//middleware
app.use('/api/', authRoutes);




app.listen(port, () => {
    console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`)
})