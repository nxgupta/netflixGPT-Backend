let express = require("express"),
  mongoose = require("mongoose"),
  dotenv = require("dotenv").config(),
  cors = require("cors"),
  gptRouter = require("./routes/chatGptRouter"),
  authRouter = require("./routes/authRouter"),
  session = require("express-session"),
  mongoStore = require("connect-mongodb-session")(session);
let app = express();
const errorHandler = require("./middlewares/errorHandler");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
mongoose
  .connect(process.env.MONGO_STRING)
  .then((resp) => {
    app.listen(8088, () => console.log("listening at 8088"));
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

const sessionStore = new mongoStore({
  uri: process.env.MONGO_STRING,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24,
});
sessionStore.on("error", function (error) {
  console.log(error);
  process.exit(1);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 1,
      secure: process.env.NODE_ENV == "development" ? false : true,
    },
    rolling: true,
    store: sessionStore,
    resave: false,
    saveUnInitialized: false,
    name: "sid",
  })
);

app.use("/api/extendsession", (req, res) => {
  return res.status(200).json({});
});
app.use("/api/logout", async (req, res) => {
  req.session.destroy();
  return res.status(200).json({});
});

app.use("/api", authRouter);
app.use("/api", gptRouter);
app.use(errorHandler);

process.on("SIGINT", async () => {
  mongoose.connection.close(true);
  console.log("mongodb connection closed successfully");
  process.exit(0);
});
