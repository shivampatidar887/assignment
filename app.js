const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
app.use(express.json());
app.use(cookieparser());
// Import Routes
const post = require("./routes/postRoute");
const user = require("./routes/userRoute");

app.use("/api/v1",post);
app.use("/api/v1",user);

// Middleware for Errors
app.use(errorMiddleware);
module.exports = app