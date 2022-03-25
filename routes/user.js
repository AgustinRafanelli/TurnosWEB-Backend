const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const { isLogged } = require("./utils");

router.post("/register", async (req, res) => {
  await User.create(req.body);
  res.send("Succesful register");
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("Succesful login");
});

router.post("/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

router.delete("/delete", isLogged, (req, res) => {
  User.destroy({ where: { id: req.user.id } });
  res.send("Succesfull delete");
});

router.get("/me", isLogged, (req, res) => {
  const { id, name, lastname, dni, email, role } = req.user;
  const user = {
    id: id,
    name: name,
    lastname: lastname,
    dni: dni,
    email: email,
    role: role,
  };
  res.send(user);
});

module.exports = router;