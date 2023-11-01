import express from "express";
import cors from "cors";
import session from "express-session";
import * as dotenv from "dotenv";
import db from "./config/database.js";

import UserRoute from "./routes/UserRoute.js";
import MenuRoute from "./routes/MenuRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SequilizeStore from "connect-session-sequelize";

dotenv.config();

const app = express();

// menambahkan SequilizeStore
const sessionStore = SequilizeStore(session.Store);
const store = new sessionStore({
    db: db
});

/* Untuk singkron otomatis db nya, eksekusi query */

// (async()=>{
//     await db.sync();
// })();

// MIDLEWARE
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    /* berfungsi untuk user dapat mengrimkan cookies beserta credentialnya */
    credentials: true,
    /* domain yang digunakan untuk mengakses API */
    origin:  'http://localhost:3000'
}));

/* untuk menerima data dalam format json */
app.use(express.json());

app.use(UserRoute);
app.use(MenuRoute);
app.use(AuthRoute);

// END MIDLEWARE

/* INI UNTUK CREATE TABLE SESSION */
// store.sync();

app.listen(process.env.APP_PORT, ()=>{
    console.log(`SERVER UP AND RUNNING`);
});


