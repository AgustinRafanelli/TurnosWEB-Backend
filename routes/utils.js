const isLogged = (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else next();
};

const isOperator = (req, res, next) => {
  if (req.user.role !== "operator") res.sendStatus(401);
  else next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") res.sendStatus(401);
  else next();
};

module.exports = { isLogged, isOperator, isAdmin };
