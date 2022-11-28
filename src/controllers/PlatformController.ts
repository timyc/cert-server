import { Request, Response } from 'express';
import { Request as JWTRequest } from 'express-jwt';
import firebase from 'firebase-admin';
import PlatformModel from '../models/PlatformModel';

export default class StudentsController {
    private pModel: PlatformModel;
    constructor() {
        this.pModel = new PlatformModel();
    }
    public test(req: Request, res: Response) {
        this.pModel.test((err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
    public async login(req: Request, res: Response) {
        await firebase.auth().verifyIdToken(req.body["token"] || "").then(async (decodedToken) => {
            this.pModel.login(decodedToken, (err?: Object, results?: Object) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json(results);
            });
        }).catch((err) => {
            return res.status(500).json({ code: "internal_error", msg: "Failed to log into your account. Please try again." });
        });
    }
    public getProfileInfo(req: JWTRequest, res: Response) {
        let uid = parseInt(req.auth?.user.id) || 0;
        if (uid == 0) {
            return res.status(500).json({ code: "internal_error", msg: "Failed to retrieve user data. Please re-login." }); 
        }
        this.pModel.profileInfo(uid, (err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
    public getLinks(req: JWTRequest, res: Response) {
        let uid = parseInt(req.auth?.user.id) || 0;
        if (uid == 0) {
            return res.status(500).json({ code: "internal_error", msg: "Failed to retrieve user data. Please re-login." }); 
        }
        this.pModel.links(uid, (err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
}