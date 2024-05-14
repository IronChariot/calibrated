// src/functions/api.js
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

exports.handler = async function(event) {
    //console.log("Path: ", event.path);
    if (event.path.endsWith("/api/models")) { // Use endsWith for flexibility
        try {
            const items = await sql`SELECT * FROM models`;
            return {
                statusCode: 200,
                body: JSON.stringify(items)
            };
        } catch (error) {
            return { statusCode: 500, body: "Server Error: " + error.toString() }
        }
    } else if (event.path.endsWith("/api/questions")) {
        try {
            const items = await sql`SELECT * FROM questions`;
            return {
                statusCode: 200,
                body: JSON.stringify(items)
            };
        } catch (error) {
            return { statusCode: 500, body: "Server Error: " + error.toString() }
        }
    } else {
        return { statusCode: 404, body: "Endpoint Not Found" };
    }
};