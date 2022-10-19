import { Request, Response } from 'express';
import connection from './DB'; 

export default class StudentsModel {
    public test(result: Function) {
        let query = `SELECT * FROM links`;
        connection.query(query, (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            return result(null, { code: "success", msg: results});
        });
    }
    public login(body: Request["body"], result: Function) {
        let query = `SELECT * FROM students WHERE email = ? AND password = ?`;
        connection.query(query, [body.email, body.password], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            if (Array.isArray(results) && results.length === 0) {
                return result({ code: "invalid_credentials", msg: "Invalid credentials"}, null);
            }
            return result(null, { code: "success", msg: results});
        });
    }
}