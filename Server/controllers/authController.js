import ErrorHandler from "../middlewares/errorMiddleware.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";
import {generateResetPasswordToken} from "../utils/generateResetPasswordToken.js"
import { generateEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js"
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import {v2 as clodinary} from "cloudinary"

export const register = catchAsyncErrors(async(req,res,next)=>{
       
    const {name, email, password} = req.body;
       
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

export const login =    catchAsyncErrors(async(req,res,next)=>{
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

export const getUser =  catchAsyncErrors(async(req,res,next)=>{
  //  const user = req.user; this way is aslo fine
  
  const {user} = req; 
  res.status(200).json({
    success:true,
    user,
  });
  
  /*
    yha pr getUser wla controller tb use me aayega jab user authenticated hoga means
    isAuthenticated hoga and for that reason jab ham isAuthenticated
    kr rhe toh req.user main se us single logged in user ko utha ke le aao
  */
})

export const logout =   catchAsyncErrors(async(req,res,next)=>{
    
  res.status(200).cookie("token", "", { 
      expires: new Date(Date.now()), //cookie delete now
      httpOnly:true, //prevent JWT from xss attacks
    })
    .json({
  success:true,
  message:"Logged Out"
})
})

export const forgotPassword = catchAsyncErrors(async(req,res,next)=>{
   
    const {email} = req.body;

    const {frontendUrl} = req.query; //??
   
    //find required mail 
    let userResult = await database.query(`SELECT * FROM users WHERE email = $1`,[email]);
  
    //if not found 
    if(userResult.rows.length === 0) {
      return next(new ErrorHandler ("Email not found" , 404));
    }

    //user is  a single tuple from users table
    const user = userResult.rows[0];

    //reset password token generate for this specific user
    const {hashedToken , resetPasswordExpireTime , resetToken} = generateResetPasswordToken();

    await database.query ( `UPDATE users SET reset_password_token = $1 , reset_password_expire = to_timestamp($2)
    WHERE email = $3`,[hashedToken , resetPasswordExpireTime/1000 , email]
    );
    //hashedTokeN ko apne pass rkha hai db main
    //expire kitne der m hoga ans postgress seconds m store krta hai isliye divide by 1000 millisecond -> second
    //resetToken ko frontend URL wle pass beja
    
    const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;
    
    const message = generateEmailTemplate(resetPasswordUrl ,user); 
    //ye fontend url jisme meri token rhegi reset wli wo send krdenge taki email m reset kr paye password
    
    try{
      await sendEmail({
        email:   user.email,
        subject:`Password Recovery`,
        message,
      });
      res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });

    }catch(error) {
      await database.query(`UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE email = $1 `,
      [email]
      );
      return next(new ErrorHandler("Email could not be sent",500))
    }
});

export const resetPassword = catchAsyncErrors(async(req,res,next) => {
 
  //while forgotPassword we send a token through email to user 
 
  const {token} = req.params;
  
  //hash the token
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  
  const user = await database.query(
    "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()",[resetPasswordToken]
  ) //>now() means token expire nai hua hai abhi tk
  
  if(user.rows.length === 0){
    return next (new ErrorHandler("Invalid or expired token",400))
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match",400));
  }

  if(
    //password requested from frontend 
    req.body.password?.length < 8 ||
    req.body.password?.length >16 ||
    req.body.confirmPassword?.length < 8 || 
    req.body.confirmPassword?.length > 16
  ){
    return next(
      new ErrorHandler ("Password must be between 8 and 20 characters.",400)
    )
  }
  //hash the newPassword
  const hashedPassword = await bcrypt.hash(req.body.password,10);
  
  //update in db for newPassword
  const updateInfo = await database.query(
    `UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2 RETURNING *`,[hashedPassword,user.rows[0].id]
  ); //get the id for the user whom is getting updated 

  //and new token is created
  sendToken(updateInfo.rows[0],200,"Password reset successfully", res)

})

//only authenticated user will update this
export const updatePassword = catchAsyncErrors ( async (req,res,next)=>{
 const { currentPassword , newPassword , confirmNewPassword} = req.body;

 if(!currentPassword || !newPassword || !confirmNewPassword){
  return next ( new ErrorHandler("All fields are required to update password" , 400));
 }
 
 //compare user password with password we are entering currently
 //req.user contains password 
 const isPasswordMatch = await bcrypt.compare(currentPassword,req.user.password);
 
 if(!isPasswordMatch){
  return next(new ErrorHandler("Password is not matching with original password",401));
  //401 forbidden
 }

 if(newPassword !== confirmNewPassword){
  return next(new ErrorHandler("New password doesn't match with confirm new password"),400);
 }

 if(
    //password yha pr mil  gya hai and upar handle v kra hai aagr nai mila toh error return krna hai but upar nai mila hai so ? this operator is used
    newPassword.length < 8 ||
    newPassword.length >16 ||
    confirmNewPassword.length < 8 || 
    confirmNewPassword.length > 16
  ){
    return next(
      new ErrorHandler ("Password must be between 8 and 20 characters.",400)
    )
  }
  //hash new password as well
  const hashedPassword = await bcrypt.hash(newPassword,10);
  //update new password in database
  await database.query("UPDATE users SET password = $1 WHERE id = $2",[hashedPassword,req.user.id]);

  res.status(200).json({
    success:true,
    message:"Password is updated successfully"
  })
});

//only authenticated user will update profile
export const updateProfile = catchAsyncErrors(async (req,res,next)=>{
  
  //name and email which is going to be updated
  const {name , email} = req.body;
 
  if(!name || !email) {
    return next(new ErrorHandler ("Please provide all the fields..",400));
  }
  
  if(name.trim().length === 0 || email.trim().length === 0 ){
    return next ( new ErrorHandler("Name and email can not be empty",400));
  }
  let avatarData = {}; //var
  
  //req ki file m se and req ke file ke avatar hai toh avatar niklo bhar from re
  if(req.files && req.files.avatar) {

    const {avatar} = req.files; //from postman

    // means??
    if(req.user?.avatar?.public_id){
      await cloudinary.uploader.destroy(req.user.avatar.public_id)
    }
   
    const newProfileImage = await cloudinary.uploader.upload(
      avatar.tempFilePath,{
      folder: "Ecommerce_Avtars", //folder name where avatar will be uploaded
      width: 150, //width
      crop: "scale" //optimal quality
    })

    avatarData = {
      public_id: newProfileImage.public_id,
      url: newProfileImage.secure_url,
    }
    //public_id && secure_url will get from cloudinary
  }
  
  let user; //variable

  //if avtar data nai aya toh name and email ko update
  if(Object.keys(avatarData).length === 0){

    user = await database.query(
      "UPDATE users SET name = $1 , email = $2 WHERE id = $3 RETURNING * ",
      [name, email, req.user.id]
    );
    
  } 
  else{
    user = await database.query
      ("UPDATE users SET name = $1 , email = $2, avatar = $3 WHERE id= $4 RETURNING *",
      [name, email, avatarData, req.user.id]
    )
  }
  console.log("1111111111111")
 
  //ressponse
  res.status(200).json({
    success: true,
    message: "Profile updated Sucessfully",
    user: user.rows[0]
  })
})