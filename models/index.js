const User = require("./User")
const Turn = require("./Turn")
const Branch = require('./Branch')
const Token = require("./Token")

User.hasOne(Branch)
Branch.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

User.belongsToMany(Branch, { through: Turn , as: 'turn'})
Branch.belongsToMany(User, { through: Turn , as: 'turn'})


module.exports = { User, Turn, Branch } 