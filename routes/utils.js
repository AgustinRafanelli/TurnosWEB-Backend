/**
 * Revisa que halla un usuario logueado
 */
const isLogged = (req, res, next) => {
  console.log("entro")
  if (!req.user) res.sendStatus(401);
  else next();
};

/**
 * Revisa que el usuario este logueado sea un operador
 */
const isOperator = (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else if (req.user.role !== "operator") res.sendStatus(401);
  else next();
};

/**
 * Revisa que el usuario este logueado sea un administrador
 */
const isAdmin = (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else if (req.user.role !== "admin") res.sendStatus(401);
  else next();
};

module.exports = { isLogged, isOperator, isAdmin };