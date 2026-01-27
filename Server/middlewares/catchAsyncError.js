export const catchAsyncErrors = (theFunction) =>{
    return (req,res,next) =>{
        Promise.resolve(theFunction(req,res,next)).catch(next); //if error comes move to cath block .catch()
        //next will execute error middleware
    }
}
//theFunction can be any thing like signup user 
//if register fails next middleware is called that is app.use(errorMiddleware) in app.js