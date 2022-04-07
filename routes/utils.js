const { User, Branch } = require("../models")

/**
 * Revisa que halla un usuario logueado
 */
const isLogged = (req, res, next) => {
  if (!req.user) res.status(401).send("Not Logged")
  else next();
};

/**
 * Revisa que el usuario logueado sea el mismo usuario
 */
const isSameUser = (req, res, next) => {
  if (!req.user) res.status(401).send("Not Logged")
  else if (req.user.id != req.params.id) res.status(401).send("Usuario equivocado")
  else next();
};

/**
 * Revisa que el usuario logueado sea el mismo, o sea un operador
 */
const isSameUserOrOpetator = (req, res, next) => {
  if (!req.user) res.status(401).send("Not Logged")
  else if (req.user.id == req.params.id || req.user.role === "operator") next()
  else res.status(401).send("Usuario equivocado")
};

/**
 * Revisa que el usuario logueado sea un operador 
 */
const isOperator = (req, res, next) => {
  if (!req.user) res.status(401).send("Not Logged")
  else if (req.user.role !== "operator") res.sendStatus(401);
  else next();
};

/**
 * Revisa que el usuario este logueado sea un administrador
 */
const isAdmin = (req, res, next) => {
  if (!req.user) res.status(401).send("Not Logged")
  else if (req.user.role !== "admin") res.sendStatus(401);
  else next();
};


const operatorLogin = (req, res, next) => {
  if (req.user.role === "operator") {
    return User.findByPk(req.user.id, { include: Branch })
      .then(user => {
        user.branch.turnRange = JSON.parse(user.branch.turnRange)
        return res.send({
          id: req.user.id,
          name: req.user.name,
          lastname: req.user.lastname,
          dni: req.user.dni,
          email: req.user.email,
          role: req.user.role,
          branch: user.branch
        });
      })
  } else next()
}

const  formatDate = (date) =>{
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = { isLogged, isOperator, isAdmin, isSameUser, isSameUserOrOpetator , operatorLogin, formatDate};