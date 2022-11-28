import connection from '../helpers/DB';
import * as Struct from '../helpers/Struct';

export default class InternalModel {
    shibCallback(uni_id: number, user_id: number, result: Function) {
        let query = `
        SELECT json FROM universities WHERE id = ? LIMIT 1;
        `;
        connection.query(query, uni_id, (err, results: any) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            if (results.length === 0) {
                return result({ code: "internal_error", msg: "University not found."}, null);
            }
            return result(null, { code: "success", msg: results[0]});
        });
    }
    shibCallbackSuccess(data: any, uni_id: number, user_id: number, result: Function) {
        let degrees: typeof Struct.DegreeData[] = [];
        for (let x of data) {
            let degree = new Struct.DegreeData();
            for (let y of Object.keys(x)) {
                if (y in degree) {
                    degree[y] = x[y];
                }
            }
            if (degree["holder"] == "") {
                delete degree["holder"];
            }
            degrees.push(degree);
        }
        connection.query(`SELECT * FROM users_universities WHERE user_id = ? AND uni_id = ?`, [user_id,uni_id], (err, results: any) => {
            if (err) {
                return result({ code: "internal_error", msg: err.message}, null);
            }
            if (results.length === 0) {
                connection.query(`INSERT INTO users_universities (user_id, uni_id, json) VALUES (?, ?, ?)`, [user_id, uni_id, JSON.stringify(degrees)], (err, results: any) => {
                    if (err) {
                        return result({ code: "internal_error", msg: err.message}, null);
                    }
                    return result(null, { code: "success", msg: results});
                });
            } else {
                connection.query(`UPDATE users_universities SET json = ? WHERE user_id = ? AND uni_id = ?`, [JSON.stringify(degrees), user_id, uni_id], (err, results: any) => {
                    if (err) {
                        return result({ code: "internal_error", msg: err.message}, null);
                    }
                    return result(null, { code: "success", msg: results});
                });
            }
        });
    }
}