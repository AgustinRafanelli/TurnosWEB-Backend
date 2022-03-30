const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const { isLogged, isAdmin } = require("./utils");

router.post("/register", isLogged, isAdmin, async (req, res) => {
  const branch = await Branch.create(req.body);
  res.send(branch);
});

router.get("/all",isLogged, async (req, res) => {
  const branchs = await Branch.findAll();
  return res.send(branchs);
});

router.delete("/:id", isLogged, isAdmin, (req, res) => {
  Branch.destroy({ where: { id: req.params.id } });
  res.send("Sucursal eliminada");
});

module.exports = router;
