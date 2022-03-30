const express = require("express");
const router = express.Router();
const {Branch, User} = require("../models");
const { isLogged, isAdmin } = require("./utils");

router.post("/register", isAdmin, async (req, res) => {
  const branch = await Branch.create(req.body);
  res.send(branch);
});

router.get("/:id", (req, res, next) => {
  Branch.findByPk(req.params.id)
    .then(branch => {
      if(!branch) return res.sendStatus(400)
      res.send(branch)
    })
    .catch(next)
});

router.get("/all", async (req, res) => {
  const branchs = await Branch.findAll();
  return res.send(branchs);
});

router.delete("/:id", isAdmin, (req, res) => {
  Branch.destroy({ where: { id: req.params.id } });
  res.send("Sucursal eliminada");
});

module.exports = router;
