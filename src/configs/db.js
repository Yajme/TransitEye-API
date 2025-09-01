import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DB_CONNECTION_STRING;

const connection = new pg.Client({
  connectionString : connectionString
});

function initDatabase(){
  connection.connect().then(()=>{
    console.log('Successfully connected to the database');
  }).catch(err=>{
    console.log('Connection error', err.stack);
  })
}


export default {
  initDatabase,
  connection
}
