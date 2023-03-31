const catchasyncerror = require("./catchasyncerror");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.isAuthenticatedUser = catchasyncerror(async(req,res,next)=>{

      // Extract token from cookies
      const {token} = req.cookies;
    
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Please login to access this resources"
        })
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);       // we use user id for create token with secret key
     next();
})

