const app = require("./app");

const dotenv= require("dotenv");
const connectDatabase = require("./middleware/database");
const bodyParser = require("body-parser");
// Handling Uncaughed exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting Down the server due to Uncaughed exception`);
    process.exit(1);
})

app.use(bodyParser.json());
// Use Config
dotenv.config({path:"./middleware/config.env"});
const port = process.env.PORT ||3024;
// Connecting to database
connectDatabase();
const server = app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`);
});

