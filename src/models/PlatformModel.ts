import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import * as jwt from 'jsonwebtoken';
import connection from '../helpers/DB'; 

export default class PlatformModel {
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
    public profileInfo(uid: number, result: Function) {
        let query = `
        SELECT platforms.name
        FROM platforms,users
        WHERE platforms.id = users.platform_id 
        AND users.id = ?;
        `;
        connection.query(query, [uid], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            return result(null, { code: "success", msg: results});
        });
    }
    public links(uid: number, result: Function) {
        let query = `
        SELECT q2.name, q1.expires, q1.url FROM 
(
SELECT * FROM links, users WHERE links.platform = users.platform_id AND users.id = ?
 ) as q1
JOIN 
 (
SELECT * FROM users
 ) as q2
 ON q1.user = q2.id;
        `;
        connection.query(query, [uid], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            return result(null, { code: "success", msg: results});
        });
    }
}