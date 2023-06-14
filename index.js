// SERVER FOR OMONGIN APP
if (process.env.NODE_ENV == 'development') {
  require("dotenv").config();
  console.log(`Berjalan pada environment: ${process.env.NODE_ENV}`);
}

const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || process.env.DEV_PORT;
const indexRouter = require("./routes/index.js");
const errorHandlers = require("./middlewares/errorHandlers");

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(indexRouter);
app.use(errorHandlers);

app.listen(PORT, () => {
  console.log(`Aplikasi ini berjalan pada port ${PORT}`);
});

module.exports = app;
