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
}