const mongoose = require("mongoose");



// const connectDatabase = () => {
//   // console.log(process.env.DB_URI);
  
//   mongoose.connect(process.env.DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       // useCreateIndex: true,
//     })
//     .then(() => {
//       console.log(`Mongodb connected with server`);
//     }).catch((err)=>{
//       console.log(err);
//     });
// };

const connectDatabase = async () =>{
  try{
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB connected')
  } catch(err){
    console.log(`Database error: ${err}`)
  }
  

}

module.exports = connectDatabase;
