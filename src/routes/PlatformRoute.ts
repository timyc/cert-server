import { Express, Request, Response }  from 'express';
import PlatformController from '../controllers/PlatformController';

module.exports = (app: Express) => {
    const router = require('express').Router();
    const pController = new PlatformController();
    // NEED to use arrow function or else 'this' methods will be undefined (within the controller)

    // GET routes
    router.get('/test', (req: Request, res: Response) => pController.test(req, res));
    // POST routes
    router.post('/login', (req: Request, res: Response) => pController.login(req, res));
    router.post('/profile', (req: Request, res: Response) => pController.getProfileInfo(req, res));
    router.post('/links', (req: Request, res: Response) => pController.getLinks(req, res));

    app.use('/pAPI', router);
};