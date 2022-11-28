import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import connection from '../helpers/DB';

export default class StudentsModel {
    public test(result: Function) {
        let query = `SELECT * FROM links`;
        connection.query(query, (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message }, null);
            }
            return result(null, { code: "success", msg: results });
        });
    }
    public login(token: DecodedIdToken, result: Function) {
        let query = `SELECT * FROM users WHERE firebase_uid = ?`;
        connection.query(query, [token.uid], (err, results: any) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message }, null);
            }
            if (results.length === 0) { // will need to create a new user in the database!
                connection.query(`INSERT INTO users (firebase_uid, name, email, access) VALUES (?, ?, ?, 1)`, [token.uid, token.name, token.email], (err, results: any) => {
                    if (err) {
                        return result({ code: "internal_error", msg: err.message }, null);
                    }
                    connection.query(`SELECT * FROM users WHERE firebase_uid = ?`, [token.uid], (err, results2: any) => {
                        if (err) {
                            return result({ code: "internal_error", msg: err.message }, null);
                        }
                        const signedToken = jwt.sign({ user: results2[0] }, process.env.JWT_SECRET || "poopysecret", { algorithm: 'HS256' });
                        return result(null, { code: "success", msg: { token: signedToken, results: results2 } });
                    });
                });
            } else {
                const token = jwt.sign({ user: results[0] }, process.env.JWT_SECRET || "poopysecret", { algorithm: 'HS256' });
                return result(null, { code: "success", msg: { token: token, results: results } });
            }
        });
    }
    public search(ss: string, limit: number, result: Function) {
        let query = `SELECT id,name FROM universities WHERE name LIKE ? LIMIT ${limit}`;
        connection.query(query, [`%${ss}%`], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message }, null);
            }
            return result(null, { code: "success", msg: results });
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
                return result({ code: "internal_error", msg: err.message }, null);
            }
            connection.query(`SELECT * FROM users WHERE id = ?`, [uid], (err, results2: any) => {
                if (err) {
                    return result({ code: "internal_error", msg: err.message }, null);
                }
                return result(null, { code: "success", msg: [results, results2[0]] }); // results = universities, results2 = user
            });
        });
    }
    public shibbolethLogin(uni_id: number, user_id: number, result: Function) {
        let query = `
        SELECT * FROM universities WHERE id = ? LIMIT 1;
        `;
        connection.query(query, uni_id, (err, results: any) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message }, null);
            }
            // Sign a temporary JWT that expires in 5 minutes
            const token = jwt.sign({ user: user_id, university: uni_id }, process.env.JWT_SECRET || "poopysecret", { expiresIn: 5 * 60, algorithm: 'HS256' });
            return result(null, { code: "success", msg: { token: token, url: results[0].auth_url } });
        });
    }

    public changeAvatar(uid: number, avatar: string, result: Function) {
        let query = `UPDATE users SET avatar = ? WHERE id = ?`;
        connection.query(query, [avatar, uid], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message }, null);
            }
            return result(null, { code: "success", msg: results });
        });
    }

    public retrieveProfileLink(id: string, result: Function) {
        let query = `SELECT user FROM links WHERE url = ?`;
        connection.query(query, [id], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message }, null);
            }
            if ((results as any).length === 0) {
                return result({ code: "not_found", msg: "Link not found" }, null);
            }
            return this.profileInfo(results[0].user, result);
        });
    }

    public createProfileLink(uid: number, result: Function) {
        connection.query(`SELECT * FROM links WHERE user = ?`, [uid], (err, results) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message }, null);
            }
            if ((results as any).length === 0) {
                const url = this.uniqid(this.bin2hex(this.random_bytes(16)));
                connection.query(`INSERT INTO links (user, url) VALUES (?,?)`, [uid, url], (err, results) => {
                    if (err) {
                        return result({ code: "internal_error", msg: err.message }, null);
                    }
                    return result(null, { code: "success", msg: url });
                });
            } else {
                connection.query(`SELECT url FROM links WHERE user = ?`, [uid], (err, results) => {
                    if (err) {
                        return result({ code: "internal_error", msg: err.message }, null);
                    }
                    return result(null, { code: "success", msg: results[0].url });
                });
            }
        });

    }
    private random_bytes(size: number): string {
        return crypto.randomBytes(size).toString();
    }
    private bin2hex(s: string) {
        let i, l, o = '', n;
        s += '';
        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i)
                .toString(16);
            o += n.length < 2 ? '0' + n : n;
        }
        return o;
    }
    private uniqid (prefix: string, more_entropy: boolean = false) {
        if (typeof prefix === 'undefined') {
            prefix = '';
        }
        let retId;
        let formatSeed = function (seed, reqWidth) {
            seed = parseInt(seed, 10)
                .toString(16); // to hex str
            if (reqWidth < seed.length) { // so long we split
                return seed.slice(seed.length - reqWidth);
            }
            if (reqWidth > seed.length) { // so short we pad
                return Array(1 + (reqWidth - seed.length))
                    .join('0') + seed;
            }
            return seed;
        };
        let uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
        uniqidSeed++;
        // start with prefix, add current milliseconds hex string
        retId = prefix;
        retId += formatSeed((new Date().getTime() / 1000).toFixed(10), 8);
        // add seed hex string
        retId += formatSeed(uniqidSeed, 5);
        if (more_entropy) {
            // for more entropy we add a float lower to 10
            retId += (Math.random() * 10)
                .toFixed(8)
                .toString();
        }
        return retId;
    }
}