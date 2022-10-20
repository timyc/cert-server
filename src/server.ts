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
dotenv.config();

const app: Express = express();
const port = process.env.HTTP_PORT;
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
})); // allow cross-origin requests
app.use(bodyParser.json()); // support json encoded bodies
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET || "poopysecret",
    algorithms: ["HS256"],
  }).unless({ path: ["/sAPI/login"] }) // API routes to exclude from JWT verification, usually login routes
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