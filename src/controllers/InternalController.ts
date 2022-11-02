import { Request, Response } from 'express';
import { Request as JWTRequest } from 'express-jwt';
import InternalModel from '../models/InternalModel';

export default class InternalController {
    private iModel: InternalModel;
    constructor() {
        this.iModel = new InternalModel();
    }
    test(req: Request, res: Response) {
        res.send('Internal Controller Test');
    }
    shibCallback(req: JWTRequest, res: Response) {
        let uni_id:number = parseInt(req.auth?.university) || 0;
        let user_id:number = parseInt(req.auth?.user) || 0;
        let uni_id2:number = parseInt(req.body["universityId"]) || 0;
        let user_id2:number = parseInt(req.body["studentId"]) || 0;
        if (uni_id == 0 || user_id == 0 || uni_id != uni_id2 || user_id != user_id2) {
            return res.status(500).json({ code: "internal_error", msg: "Failed to retrieve user data. Please re-login." });
        }
        this.iModel.shibCallback(uni_id, user_id, (err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
    shibCallbackSuccess(req: JWTRequest, res: Response) {
        let uni_id:number = parseInt(req.auth?.university) || 0;
        let user_id:number = parseInt(req.auth?.user) || 0;
        let data:object;
        try {
            data = JSON.parse(req.body["results"]);
        } catch (e) {
            return res.status(500).json({ code: "internal_error", msg: "Improperly formatted data received from your university." });
        }
        if (uni_id == 0 || user_id == 0) {
            return res.status(500).json({ code: "internal_error", msg: "Invalid user/university configuration" });
        }
        this.iModel.shibCallbackSuccess(data,uni_id,user_id, (err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
}