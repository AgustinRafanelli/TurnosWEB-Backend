const express = require("express");
const router = express.Router();
const { Branch, User, Turn } = require("../models");
const { Op } = require("sequelize")
const { isAdmin } = require("./utils");
const sgMail = require('../config/sendgrid')
const emails = require('./emailTemplates')

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

router.delete("/:id", isAdmin, (req, res) => {
  Branch.findByPk(req.params.id)
    .then(branch => {
      branch.getUser().then(user => user.destroy())
      Turn.findAll({ where: { branchId: req.params.id } })
        .then(turns => {
          turns.map(turn => {
            turn.getUser()
              .then(user => sgMail.send(emails.canceledTurnEmail(user.email)))
          })
        })
        .then(() => Turn.destroy({ where: { branchId: req.params.id } }))
      branch.destroy()
    })
    .then(() => res.status(202).send("Sucursal eliminada con exito"))
    .catch(err => res.status(400).send(err))
});

router.put("/:id", isAdmin, function (req, res, next) {
  const { name, coords, turnRange, maxPerTurn } = req.body;
  Branch.update(
    {
      name: name,
      coords: coords,
      turnRange: JSON.stringify(turnRange),
      maxPerTurn: maxPerTurn,
    },
    {
      where: {
        id: req.params.id,
      },
      returning: true
    }
  )
    .then(([_, branch]) => branch[0].getUser())
    .then(user => user.update({ name }))
    .then(user => res.sendStatus(204))
    .catch(next);
});

router.get("/all", async (req, res) => {
  const branchs = await Branch.findAll();
  return res.send(branchs);
});

router.get("/adminview", async (req, res) => {
  const branchs = await Branch.findAll({
    include: { model: User, attributes: ["email"] },
  });
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
    const disponibility = await Branch.findByPk(branchId)
      .then(branch => {
        const branchOpen = JSON.parse(branch.turnRange)
        const hours = branchOpen.close - branchOpen.open
        return hours * 4 * branch.maxPerTurn
      })
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
    const pending = await Turn.count({
      where: {
        branchId,
        date: {
          [Op.between]: [startDate, finishDate]
        },
        state: "pending"
      }
    })
    res.send({ disponibility, pending, assisted, missed, canceled })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

/* router.get('/turnDensity/:branchId/:startDate/:finishDate', (req, res, next) => {
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
      
    })
    .catch(err => res.status(400).send(err))
}) */

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

router.get('/turnInAdvnace/all/:startDate/:finishDate', (req, res, next) => {
  const { branchId, startDate, finishDate } = req.params
  Turn.findAndCountAll({
    where: {
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
