const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const { isLogged } = require("./utils");

router.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.send({
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    dni: user.dni,
    email: user.email,
    role: user.role,
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send({
    id: req.user.id,
    name: req.user.name,
    lastname: req.user.lastname,
    dni: req.user.dni,
    email: req.user.email,
    role: req.user.role,
  });
});

router.post("/logout", (req, res) => {
  req.logout();
  res.status(200).send({});
});

router.delete("/", isLogged, (req, res) => {
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