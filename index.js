// SERVER FOR OMONGIN APP
let morgan = null
if (process.env.NODE_ENV === 'development') {
  require("dotenv").config();
  morgan = require("morgan")
}

console.log(`Berjalan pada environment: ${process.env.NODE_ENV}`);

const express = require("express");
const app = express();
const cors = require("cors");
// const path = require("path");
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`)

console.log(`process.env.PORT: ${process.env.PORT}`)
console.log(`process.env.DEV_PORT: ${process.env.DEV_PORT}`)
const PORT = process.env.PORT || process.env.DEV_PORT;
const indexRouter = require("./routes/index.js");
const errorHandlers = require("./middlewares/errorHandlers");

// app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV == 'development') {
  app.use(morgan("dev"));
}

app.use(indexRouter);
app.use(errorHandlers);

app.listen(PORT, () => {
  console.log(`Aplikasi ini berjalan pada port ${PORT}`);
});

module.exports = app;
