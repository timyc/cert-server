import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import * as jwt from 'jsonwebtoken';
import connection from '../helpers/DB'; 

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
    public login(token: DecodedIdToken, result: Function) {
        let query = `SELECT * FROM users WHERE firebase_uid = ?`;
        connection.query(query, [token.uid], (err, results: any) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            if (results.length === 0) { // will need to create a new user in the database!
                connection.query(`INSERT INTO users (firebase_uid, name, email, access) VALUES (?, ?, ?, 1)`, [token.uid, token.name, token.email], (err, results: any) => {
                    if (err) {
                        return result({ code: "internal_error", msg: err.message}, null);
                    }
                    const token = jwt.sign({ user: results[0] }, process.env.JWT_SECRET || "poopysecret", { algorithm: 'HS256'});
                    return result(null, { code: "success", msg: {token: token, results: results}});
                });
            } else {
                const token = jwt.sign({ user: results[0] }, process.env.JWT_SECRET || "poopysecret", { algorithm: 'HS256'});
                return result(null, { code: "success", msg: {token: token, results: results}});
            }
        });
    }
    public search(ss: string, limit: number, result: Function) {
        let query = `SELECT id,name FROM universities WHERE name LIKE ? LIMIT ${limit}`;
        connection.query(query, [`%${ss}%`], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            return result(null, { code: "success", msg: results});
        });
    }
    public profileInfo(uid: number, result: Function) {
        let query = `
        SELECT universities.name, universities.image, users_universities.json 
        FROM universities,users_universities
        WHERE universities.id = users_universities.uni_id
        AND users_universities.user_id = ?;
        `;
        connection.query(query, [uid], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            return result(null, { code: "success", msg: results});
        });
    }
    public shibbolethLogin(uni_id: number, user_id: number, result: Function) {
        let query = `
        SELECT * FROM universities WHERE id = ? LIMIT 1;
        `;
        connection.query(query, uni_id, (err, results: any) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            // Sign a temporary JWT that expires in 5 minutes
            const token = jwt.sign({ user: user_id, university: JSON.parse(results[0].json).secret }, process.env.JWT_SECRET || "poopysecret", { expiresIn: 5 * 60, algorithm: 'HS256'});
            return result(null, { code: "success", msg: {token: token, url: results[0].auth_url}});
        });
    }

}