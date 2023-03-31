const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"Please Enter Your name"],
    maxLength:[30,"Name can not exceed 30 characters"],
    minLength:[4,"Name Should have more then 4 characters"],
},
email:{
    type:String,
    required:[true,"Please enter you email"],
    unique:true,
    validate:[validator.isEmail,"Please Enter a Valid Email"],
},
password:{
    type:String,
    required:[true,"Please Enter Your Password"],
    maxLength:[25,"Password can not exceed 25 characters"],
    minLength:[4,"Password Should have morre then 4 characters"],
    select:false,         // cannot acess password by find method
},
mobile:{
    type: String,
    minLength: [10, "no should have minimum 10 digits"],
    maxLength: [10, "no should have maximum 10 digits"],
    match: [/\d{10}/, "no should only have digits"],
    required:[true,"Please Enter Your Password"]
},
createdAt:{
    type:Date,
    default:Date.now,
},
});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){     // not rehash already hashed password at the time of Update profile
        next();
    }
    this.password= await  bcrypt.hash(this.password,10);
});
//JWT token
userSchema.methods.getJWTToken = function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{   // make token from secret key and user id
        expiresIn:process.env.JWT_EXPIRE
    })

};

// compare password
userSchema.methods.comparePassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password);
};

module.exports=mongoose.model("User",userSchema);