import ErrorHandler from "../middlewares/errorMiddleware.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";


export const register = catchAsyncErrors(async(req,res,next)=>{
       
    const {name, email, password} = req.body;
       console.log(email)
        if(!name || !email || !password){
        return next(new ErrorHandler("please provide all required fields",400));
       }
        if(password.length < 8 || password.length > 16 ){
        return next(new ErrorHandler("Password should be in between 8 to 16 chars",400));
      }
      
       const isAlreadyRegistered = await database.query(
        `SELECT * FROM users  WHERE email = $1`,[email] //$1 means whatever is just after comma and [email] is array
      );
       if (isAlreadyRegistered.rows.length > 0) {
       return next(
        new ErrorHandler("User already registered with this email.", 400)
    );
    //here next middleware is ErrorHandler itself
  }

   const hashedPassword = await bcrypt.hash(password,10);
   const user = await database.query(
         "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
         [name, email, hashedPassword]
   );
    sendToken(user.rows[0],201,"User Registered", res);
    ////pg returns query results as an object where rows is an array of records, so rows[0] represents a single row.
})

export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
      return next(new ErrorHandler("Please provide email and password",400));
    }
    //find row for that email and stored it in user here user is a single user
    const user = await database.query(`SELECT * from users WHERE email = $1`,[email]);
   //if no row is found 
    if(user.rows.length === 0){
      return next(new ErrorHandler(`Invalid email and password`,401));
    }
    //verify password with hashed pass
    const isPasswordMatch = await bcrypt.compare(password,user.rows[0].password);

    if(!isPasswordMatch){
      return next(new ErrorHandler (`Invalid email or password`,401));
    }
    
    //
    sendToken(user.rows[0],200,"Logged IN",res);
    //no new user is created so 200
    //pg returns query results as an object where rows is an array of records, so rows[0] represents a single row.

})

export const getUser = catchAsyncErrors(async(req,res,next)=>{
  //  const user = req.user; 
  const {user} = req; 
  /*
    yha pr getUser wla controller tb use me aayega jab user authenticated hoga means
    isAuthenticated hoga and for that reason jab ham isAuthenticated
    kr rhe toh req.user hmri 
  */
})

export const logout = catchAsyncErrors(async(req,res,next)=>{
    
})