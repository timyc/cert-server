import express, { ErrorRequestHandler, Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { expressjwt } from "express-jwt";
import * as fs from 'fs';
import * as path from 'path';
import * as firebase from 'firebase-admin';
import { NextFunction } from 'connect';

const fbconfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../configs/firebase.json`)).toString());
firebase.initializeApp({credential: firebase.credential.cert(fbconfig)});
dotenv.config({ path: path.resolve(__dirname, `../.env`) }); // need to do it like this so .env files work with ts-node

const app: Express = express();
const port = process.env.HTTP_PORT;
const whitelist = JSON.parse(process.env.CORS_ORIGIN || "[]");
app.use(cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
})); // allow cross-origin requests
app.use(bodyParser.json()); // support json encoded bodies
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET || "poopysecret",
    algorithms: ["HS256"],
  }).unless({ path: ["/sAPI/login", "/sAPI/search"] }) // API routes to exclude from JWT verification, usually login routes
);

// Students routes

require('./routes/StudentsRoute')(app);

// Return 404 for undefined routes

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ code: "internal_error", msg: "Resource not found"});
});

// This is the general error handler

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ code: "internal_error", msg: "Something went wrong. Please try again." }); // may be a bit cryptic, but it's better than nothing
});

// Start the server

app.listen(port, () => {
  console.log(`[server]: Server is running at on port ${port}`);
});