const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("cookie-session");
const passport = require("passport");
const passportConfig = require("./config/passport");
const routes = require("./routes");
const db = require("./config/db");
const models = require("./models");
const cron = require("./config/cron");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(
  session({
    secret: "user",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(passportConfig.localStrategyInstance);

passport.serializeUser(passportConfig.serializeUserCb);

passport.deserializeUser(passportConfig.deserializeUserCb);

app.use("/", routes)

app.use("/", (req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

const PORT = process.env.PORT || 3001;

db.sync({ force: false }).then(() =>
  app.listen(PORT, () => console.log(`Listening port ${PORT}`))
);