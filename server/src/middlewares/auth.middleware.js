import { validateUserToken } from '../utils/token.js';


export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }

  const token = authHeader.split(" ")[1];
  const payload = validateUserToken(token);

  if (!payload || !payload.id) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.user = payload; // { id: "..." }
  next();
}


//not used abhi badme dekte if kam aya 
export function ensureAuthenticated(req,res,next){
    if ( !req.user || !(req.user.id)) {
    return res.status(400).json({ error: "Unauthorized User" });
  }
  next();
}