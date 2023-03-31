const User= require("../models/userModel");
const catchAsyncErrors = require("../middleware/catchasyncerror");
const sendToken = require("../middleware/jwtToken");
const Post = require("../models/postModel");
// const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");
// const cloudinary = require("cloudinary");
// const jwtDecode = require("jwt-decode");

// create a user 
exports.createUser = catchAsyncErrors(async(req,res,next)=>{
     const {name,email,mobile,password} = req.body;
     const user= await User.create({
      name,email,mobile,password,
     });
     sendToken(user,201,res);
});
// Get all users
exports.AllUsers = catchAsyncErrors(async(req,res,next)=>{
     const users= await User.find();
     res.status(200).json({
        success:true,
        users,
     })
});

// Login user 
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please Enter Email and Password"
        })
    }
    const user= await User.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({
            success:false,
            message:"Invalid Email and Password"
        })
    }
    const isPasswordmatched = await user.comparePassword(password);
    if(!isPasswordmatched){
        return res.status(401).json({
            success:false,
            message:"Invalid Email and Password"
        })
    }
   sendToken(user,200,res);
});
// Log out
exports.logoutUser = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        succes:true,
        message:"Log out successfully",
    })
});
// get login user details
exports.getUserdetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
});
// update user Passoword
exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordmatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordmatched){
        return res.status(400).json({
            success:false,
            message:"Old password is not correct"
        })
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Passwords dose not matched! Enter carefully"
        })
    }
    user.password = req.body.newPassword;
    await user.save();
    const jwt=user.getJWTToken();
    // option for cookie
    const option={
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000
        ),
        httpOnly:true,
    };

    res.status(200).cookie("token",jwt,option).json({
        success:true,
        message:"Password Updated Successfully!"
    })
});
// update user Profile
exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
    }
   const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
   });
    res.status(200).json({
        success:true,
        message:"profile update successfully",
    })
});
// Delete User Account
exports.deleteAccount = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    // Delete all the posts that belong to the user
    await Post.deleteMany({ user: userId });
    
    const user = await User.findById(userId);
    await User.findByIdAndRemove(userId);
    
    res.status(200).json({
      success: true,
      message: "Your Account and posts deleted successfully... See You Again!",
    });
  });