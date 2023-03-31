
module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode ||500;
    err.message = err.message || "Internel server Error";
    // wrong mongodb id error
    if(err.name==="CastError"){
    const message = `Resources Not found. Invalid : ${err.path}`;
    return res.status(404).json({
        success:false,
        err:message
    })
    }
    // Mongoose duplicate key error
    if(err.code===11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
        return res.status(400).json({
            success:false,
            err:message
        })
    }
    // // wrong JWT error
    // if(err.name ==="JsonWebTokenError"){
    //     const message = `Json web token is invalid , try again`;
    //     return res.status(400).json({
    //         success:false,
    //         err:message
    //     })
    // }
    // // JWT Expire error
    // if(err.name ==="TokenExpiredError"){
    //     const message = `Json web token is Expired , try again`;
    //     return res.status(400).json({
    //         success:false,
    //         err:message
    //     })
    // }
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}