import { Express, Request, Response }  from 'express';
import StudentsController from '../controllers/StudentsController';

module.exports = (app: Express) => {
    const router = require('express').Router();
    const sController = new StudentsController();
    // NEED to use arrow function or else 'this' methods will be undefined (within the controller)

    // GET routes
    router.get('/test', (req: Request, res: Response) => sController.test(req, res));
    router.get('/search', (req: Request, res: Response) => sController.search(req, res));

    // POST routes
    router.post('/login', (req: Request, res: Response) => sController.login(req, res));
    router.post('/profile', (req: Request, res: Response) => sController.getProfileInfo(req, res));
    router.post('/shibboleth', (req: Request, res: Response) => sController.shibbolethLogin(req, res));
    
    app.use('/sAPI', router);
};