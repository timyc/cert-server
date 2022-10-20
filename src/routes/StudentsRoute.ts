import { Express, Request, Response }  from 'express';
import StudentsController from '../controllers/StudentsController';

module.exports = (app: Express) => {
    const router = require('express').Router();
    const sController = new StudentsController();
    // NEED to use arrow function or else 'this' methods will be undefined (within the controller)
    router.get('/test', (req: Request, res: Response) => sController.test(req, res));
    router.post('/login', (req: Request, res: Response) => sController.login(req, res));
    app.use('/sAPI', router);
};