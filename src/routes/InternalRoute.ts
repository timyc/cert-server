import { Express, Request, Response }  from 'express';
import InternalController from '../controllers/InternalController';

module.exports = (app: Express) => {
    const router = require('express').Router();
    const controller = new InternalController();
    router.get('/test', (req: Request, res: Response) => controller.test(req, res));
    router.post('/shibCallback', (req: Request, res: Response) => controller.shibCallback(req, res));
    router.post('/shibCallbackSuccess', (req: Request, res: Response) => controller.shibCallbackSuccess(req, res));
    app.use('/iAPI', router);
};