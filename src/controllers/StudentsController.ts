import { Request, Response } from 'express';
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
}