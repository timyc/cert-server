import { Request, Response } from 'express';
import { Request as JWTRequest } from 'express-jwt';
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
    public search(req: Request, res: Response) {
        let lim = parseInt(req.query["limit"] as string) || 0;
        this.sModel.search(req.query.query as string, lim, (err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
    public getProfileInfo(req: JWTRequest, res: Response) {
        let uid = parseInt(req.auth?.user.id) || 0;
        if (uid == 0) {
            return res.status(500).json({ code: "internal_error", msg: "Failed to retrieve user data. Please re-login." }); 
        }
        this.sModel.profileInfo(uid, (err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
    public shibbolethLogin(req: JWTRequest, res: Response) {
        // The university needs to return this format of data:
        /*
        {
            "studentId": "123456789",
            "universityId": "123456789",
        }
        */
        let uni_id:number = parseInt(req.body["universityId"]) || 0;
        let user_id = parseInt(req.auth?.user.id) || 0;
        if (uni_id == 0 || user_id == 0) {
            return res.status(500).json({ code: "internal_error", msg: "Invalid request." }); 
        }
        this.sModel.shibbolethLogin(uni_id, user_id, (err?: Object, results?: Object) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    }
}