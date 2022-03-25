const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const { isLogged, isAdmin } = require("./utils");

router.post("/register", isLogged, isAdmin, async (req, res) => {
  const branch = await Branch.create(req.body);
  res.send(branch);
});

router.get("/all", async (req, res) => {
  const branchs = await Branch.findAll();
  res.send(branchs);
});

router.delete("/:id", isLogged, isAdmin, async (req, res) => {
  Branch.destroy({ where: { id: req.params.id } });
  res.send("Succdesful delete");
});

module.exports = router;
