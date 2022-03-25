const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")

const db = require("./config/db")
const models = require("./models")

const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
//app.use(express.json())

app.use('/api', (req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

const PORT = 3001;


db.sync({ force: true }).then(() =>
  app.listen(PORT, () => console.log(`Listening port ${PORT}`))
);
