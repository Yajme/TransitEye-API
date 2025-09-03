
import firebase from '#src/utils/firebase';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
dotenv.config();
const env = process.env.NODE_ENVIRONMENT;
//Log event should not be limited to errors
// but to some logs as well such as info warning etc.
const logEvent = async (fields)=>{
  log(fields.message);
    const field = {
    LogLevel : toLogLevel(fields.LogLevel??0),
    environment : env,
    requestId: fields.req.id || generateUUID(),
    client: {
      ip: fields.req.ip,
      userAgent: fields.req.headers['user-agent'],
      referrer: fields.req.headers['referer'] || null,
      headers: fields.req.headers,
    },
    request: {
      method: fields.req.method,
      url: fields.req.url,
      hostname: fields.req.hostname,
      query: fields.req.query,
      body: sanitize(fields.req.body) || null,
      protocol: fields.req.protocol,
    },
    response: {
      statusCode: fields.status,
    },
        error : {
            
            message : fields.message,
            stack : fields.stack
        },
        identifiers : {
            ...fields.data
        },
        message: fields.message,
        timestamp : getCurrentDate()
    }
    await firebase.setDocument('logs',field);
}
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function sanitize(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitiveKeys = ['password', 'token', 'authorization', 'apiKey', 'secret'];

  const clone = {};
  for (const key in obj) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      clone[key] = '***REDACTED***';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      clone[key] = sanitize(obj[key]); // recursive for nested objects
    } else {
      clone[key] = obj[key];
    }
  }
  return clone;
}

//returns the local time date to our local area
const getCurrentDate = () =>{
  // Set the timezone to Asia/Manila and get the local time
  const timezone = "Asia/Manila";
  const dateInTimezone = moment.tz(timezone);

  // Return as a Moment object (preserves timezone)
  return dateInTimezone.toDate();

}
const toLogLevel = (value)=>{
 return Object.values(LogLevel).find(level => level.value === value)?.label ?? "UNKNOWN";
}
export const LogLevel = Object.freeze({
  TRACE: { code: 10, label: "TRACE" },
  DEBUG: { code: 20, label: "DEBUG" },
  INFO:  { code: 30, label: "INFO" },
  WARN:  { code: 40, label: "WARN" },
  ERROR: { code: 50, label: "ERROR" },
  FATAL: { code: 60, label: "FATAL" }
});

export function log(message){
const now = new Date().toISOString();
console.log(`[${now}] ✅ ${message}`);
}

export default logEvent;