const User = require("./User")
const Turn = require("./Turn")
const Branch = require('./Branch')
const Token = require("./Token")

User.hasOne(Branch)
Branch.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

User.hasMany(Turn)
Turn.belongsTo(User)

Branch.hasMany(Turn)
Turn.belongsTo(Branch)

module.exports = { User, Turn, Branch } 