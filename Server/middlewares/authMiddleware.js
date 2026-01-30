import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncError.js"
import ErrorHandler from "./errorMiddleware.js";
import database  from "../database/db.js";

//authentication
export const isAuthenticated = catchAsyncErrors(async (req,res,next) => {
    const { token } = req.cookies; //token req ki cookie m pada hoga
    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }
    //verify token with secret key and store it in decoded after login
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);

    const user = await database.query(
        "SELECT * FROM users WHERE id = $1 LIMIT 1",[decoded.id]
    );
    //decoded.id jwtToken file se jo ( id:id.user.id ) yha se id aayi hai usko decoded wle se access kiye
    req.user = user.rows[0];
    next();
})

//pending
export const authorizedRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next (new ErrorHandler
                (`Role: ${req.user.role} is not acess this resource`,403));
        }
         next();
    }
   // eg . if our role is User that is ...roles : User and this ...role will come from controllers
   //if ADMIN is req.user.role means req jo kr rha uskka role ADMIN hai
   // then .includes will fails and error 403 will come
}