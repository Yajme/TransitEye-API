import pg from 'pg';
import dotenv from 'dotenv';
import { log } from '#src/utils/logger';
dotenv.config();

const connectionString = process.env.DB_CONNECTION_STRING;

const connection = new pg.Client({
  connectionString : connectionString,
  ssl: { rejectUnauthorized: false }
});
connection.on('error',(err)=>{
  console.log(err);
})
function initDatabase() {
  connection.connect()
    .then(() => {
      // Try a simple query to verify connection
      return connection.query('SELECT 1');
    })
    .then(() => {
      log('Successfully connected to the supabase database');
    })
    .catch(err => {
      console.error('Connection error:', err.stack);
    });
}


export default {
  initDatabase,
  connection
}
