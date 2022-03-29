/**
 * Revisa que halla un usuario logueado
 */
const isLogged = (req, res, next) => {
  if (!req.user) res.status(401).send("Not Logged")
  else next();
};

/**
 * Revisa que halla un usuario logueado
 */
const isSameUser = (req, res, next) => {
  if (req.user.id != req.params.id) res.status(401).send("Usuario equivocado")
  else next();
};

/**
 * Revisa que el usuario este logueado sea un operador
 */
const isOperator = (req, res, next) => {
 if (req.user.role !== "operator") res.sendStatus(401);
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

module.exports = { isLogged, isOperator, isAdmin, isSameUser };