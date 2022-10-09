import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { NextFunction } from 'connect';

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