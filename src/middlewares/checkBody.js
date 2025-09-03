
// middleware/checkBody.js
import HttpStatus from "#src/utils/http-status-codes"; // optional, for status codes
import UserError from "#src/utils/userException";
export function requireBody(req, res, next) {
if (req.method === "POST") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new UserError("Request body cannot be empty", HttpStatus.BAD_REQUEST));
    }
  }
  next();
}
