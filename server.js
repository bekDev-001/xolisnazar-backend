const dotenv = require("dotenv");
//* .env file import
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cookieParser());
app.use(cors());
const path = require("path");

//* Router imports
const adminRouter = require("./routes/adminRouter");
const indexRouter = require("./routes/indexRouter");
const paymeRouter = require("./paysys/payme/index");
const clickRouter = require("./paysys/click/index");

//* Database connection
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to the db");
  }
);

//* Secret key
app.set("api_secret_key", process.env.api_secret_key);

//* Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  express.static(path.resolve(__dirname, "..", "aaaaa", "public", "index.html"))
);

//* Route middlewares
app.get("/", (req, res) => {
  res.send("Api is working...");
});
app.use("/admin", adminRouter);
app.use("/index", indexRouter);
app.use("/payme", paymeRouter);
app.use("/click", clickRouter);

const port = 8080;
app.listen(port, process.env.host, () => {
  console.log(`Server is running on PORT ${port}`);
});
