const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const crypto = require('crypto')
const { isLogged, isSameUser } = require("./utils");
const Token = require("../models/Token");
const { serializeUser } = require("passport");

router.post("/register", (req, res) => {
  User.create(req.body)
  .then( user => res.send({
                          id: user.id,
                          name: user.name,
                          lastname: user.lastname,
                          dni: user.dni,
                          email: user.email,
                          role: user.role,
                        }) )
  .catch( error => res.status(400).send("Usuario existente") )
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

router.put("/password/change/:id", isLogged, isSameUser, passport.authenticate('local'), (req, res) => {
  User.updatePassword(req.params.id, req.body.newPassword)
  res.sendStatus(204)
});

router.post("/password/forgot", (req, res) => {
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) return res.send("No existe un usuario con ese email")
      user.createToken({ token: crypto.randomBytes(20).toString('hex') })
        .then(token => {
          const resetEmail = {
            to: user.email,
            from: 'passwordreset@turnosweb.com',
            subject: 'TurnosWeb',
            text: `
            Esta recibiendo este email porque usted (u otra persona) a redido el reinicio de clave de su cuenta.
            Porfavor clickee el siguiente link para completar el proceso:
            http://${req.headers.host}/reset/${user.id}/${token}
            Si no fue usted quien requirio esto porfavor ignore el email y su clave continuara siendo la misma.
            `,
          };
          res.send(token)
        })
    })
    .catch(err => console.log(err))
});

router.get("/password/reset/:token", (req, res) => {
  Token.findOne({ where: { token: req.params.token } })
    .then(token => {
      if (!token || token.createdAt + 3600000 > Date.now()) return res.status(401).send("El token de reinicio de clave es incorrecto o ya esta vencido")
      res.sendStatus(200)
    })
});

router.post("/password/reset/:token", (req, res) => {
  Token.findOne({ where: { token: req.params.token } })
    .then(token => {
      if (!token || token.createdAt + 3600000 > Date.now() ) return res.status(401).send("El token de reinicio de clave es incorrecto o ya esta vencido")
      User.updatePassword(token.userId, req.body.password )
      res.sendStatus(204)
    })
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