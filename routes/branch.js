const express = require("express");
const router = express.Router();
const { Branch, User, Turn } = require("../models");
const { Op } = require("sequelize")
const { isAdmin } = require("./utils");

router.post("/register", isAdmin, async (req, res) => {
  User.create({
    name: req.body.name,
    lastname: "TurnosWEB",
    email: req.body.email,
    dni: 11111111,
    role: "operator",
    password: req.body.password,
  })
    .then(user => {
      user.createBranch({
        name: req.body.name,
        coords: req.body.coords,
        maxPerTurn: req.body.maxPerTurn,
        turnRange: JSON.stringify(req.body.turnRange)
      })
        .then(branch => {
          res.sendStatus(204)
        })
    })
    .catch(err => res.status(400).send(err))
});

router.get("/all", async (req, res) => {
  const branchs = await Branch.findAll();
  return res.send(branchs);
});

router.get("/:id", (req, res, next) => {
  Branch.findByPk(req.params.id)
    .then(branch => {
      if (!branch) return res.sendStatus(400)
      res.send(branch)
    })
    .catch(next)
});

router.delete("/:id", isAdmin, (req, res) => {
  Branch.destroy({ where: { id: req.params.id } });
  res.send("Sucursal eliminada");
});

/**
 * Devuelve un objeto con horarios como key y cantidad de reservas como value
 */
router.get("/disponibility/:branchId/:date", (req, res, next) => {
  const { branchId, date } = req.params
  Turn.findAll({ where: { branchId, date, state: 'pending' } })
    .then(turns => {
      if (!turns) return res.sendStatus(400)
      let disponibility = {}
      turns.map(turn => {
        if (disponibility[turn.time]) disponibility[turn.time]++
        else disponibility[turn.time] = 1
      })
      res.send(disponibility)
    })
    .catch(next)
});

router.get('/stats/:branchId/:startDate/:finishDate', async (req, res, next) => {
  const { branchId, startDate, finishDate } = req.params
  try {
    const missed = await Turn.count({
      where: {
        branchId,
        date: {
          [Op.between]: [startDate, finishDate]
        },
        state: "missed"
      }
    })
    const assisted = await Turn.count({
      where: {
        branchId,
        date: {
          [Op.between]: [startDate, finishDate]
        },
        state: "assisted"
      }
    })
    const canceled = await Turn.count({
      where: {
        branchId,
        date: {
          [Op.between]: [startDate, finishDate]
        },
        state: "canceled"
      }
    })
    res.send({ missed, assisted, canceled })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/turnDensity/:branchId/:startDate/:finishDate', (req, res, next) => {
  const { branchId, startDate, finishDate } = req.params
  Turn.findAndCountAll({
    where: {
      branchId,
      date: {
        [Op.between]: [startDate, finishDate]
      }
    }
  })
    .then(({ count, rows }) => {
      let days = [{}, {}, {}, {}, {}, {}, {}]
      rows.map(turn => {
        let date = new Date(turn.date + ' ' + turn.time).getDay()
        if (days[date][turn.time.slice(0, 2)]) days[date][turn.time.slice(0, 2)]++
        else days[date][turn.time.slice(0, 2)] = 1
      })
      res.send(days)
    })
    .catch(err => res.status(400).send(err))
})

router.get('/turnInAdvnace/:branchId/:startDate/:finishDate', (req, res, next) => {
  const { branchId, startDate, finishDate } = req.params
  Turn.findAndCountAll({
    where: {
      branchId,
      date: {
        [Op.between]: [startDate, finishDate]
      }
    }
  })
    .then(({ count, rows }) => {
      const reduce = rows.map((turn) => (Date.parse(turn.createdAt) - Date.parse(turn.date + " " + turn.time)) / 3600000)
      const reduceResult = reduce.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      res.send({ average: reduceResult / count })
    })
})

module.exports = router;
