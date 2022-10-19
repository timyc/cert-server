import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as firebase from 'firebase-admin';
import { NextFunction } from 'connect';

const fbconfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../config/firebase.json`)).toString());
firebase.initializeApp({credential: firebase.credential.cert(fbconfig)});
dotenv.config();

const app: Express = express();
const port = process.env.HTTP_PORT;

require('./routes/StudentsRoute')(app);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ code: "internal_error", msg: "Resource not found"});
});

app.listen(port, () => {
  console.log(`[server]: Server is running at on port ${port}`);
});