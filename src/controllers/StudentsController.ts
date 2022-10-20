import { Request, Response } from 'express';
import firebase from 'firebase-admin';
import StudentsModel from '../models/StudentsModel';

export default class StudentsController {
    private sModel: StudentsModel;
    constructor() {
        this.sModel = new StudentsModel();
    }
    public test(req: Request, res: Response) {
        this.sModel.test((err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
    public async login(req: Request, res: Response) {
        await firebase.auth().verifyIdToken(req.body["token"] || "").then(async (decodedToken) => {
            this.sModel.login(decodedToken, (err?: Object, results?: Object) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json(results);
            });
        }).catch((err) => {
            return res.status(500).json({ code: "internal_error", msg: "Failed to log into your account. Please try again." });
        });

    }
}