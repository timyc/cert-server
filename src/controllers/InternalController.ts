import InternalModel from '../models/InternalModel';

export default class InternalController {
    private iModel: InternalModel;
    constructor() {
        this.iModel = new InternalModel();
    }
    test(req: any, res: any) {
        res.send('Internal Controller Test');
    };
}