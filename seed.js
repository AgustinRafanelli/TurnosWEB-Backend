const db = require("./config/db");
const { User, Turn, Branch } = require("./models");

const usersList = [
  {
    name: "admin",
    lastname: "admin",
    dni: "12345678",
    email: "admin@admin.com",
    role: "admin",
    password: "12345678",
  },
  {
    name: "fake",
    lastname: "fake",
    dni: "12345678",
    email: "client@fake.com",
    role: "client",
    password: "12345678",
  },
  {
    name: "Agustin",
    lastname: "Rafanelli",
    dni: "12345678",
    email: "agustinrafa1995@gmail.com",
    role: "client",
    password: "12345678",
  }
];
const branchList = [
  {
    name: "SUCURSAL X",
    coords: "santa+rosa+3500,ituzaingo,buenos+aires,argentina",
    maxPerTurn: 5,
    turnRange: JSON.stringify({ open: 8, close: 20 }),
  },
  {
    name: "SUCURSAL B",
    coords: "Bartolome+Mitre+326,CABA,buenos+aires,argentina",
    maxPerTurn: 2,
    turnRange: JSON.stringify({ open: 9, close: 13 }),
  },
  {
    name: "SUCURSAL C",
    coords: "Av.+Martin+Garcia+344,CABA,Buenos+Aires,argentina",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL D",
    coords: "Av.+Cabildo+2093,CABA,buenas+aires,argentina",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL E",
    coords: "Av.+Corrientes+5801,CABA,Buenos+Aires,argentina",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL F",
    coords: "Parana+3745+Unicenter,Martinez,Buenos+Aires,argentina",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL G",
    coords: "Av.+101+Dr.+Ricardo+Balbín+2549,San+Martín,Buenos+Aires,argentina",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL H",
    coords: "Chubut+5,La+Lonja,Buenos+Aires,argentina",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
];

const setupSeed = async () => {
  console.log("SEED STARTING");

  const users = await Promise.all(
    usersList.map(async (user) => {
      return await User.create(user);
    })
  );

  const branch = await Promise.all(
    branchList.map(async (branch, i) => {
      return await User.create({
        name: branch.name,
        lastname: "TurnosWEB",
        dni: "12345678",
        email: `user${i}@fake.com`,
        role: "operator",
        password: "12345678",
      })
        .then(user => user.createBranch(branch))
    })
  );

  const clients = await Promise.all(
    branchList.map(async (branch, i) => {
      return await User.create({
        name: "fake",
        lastname: "fake",
        dni: "12345678",
        email: `client${i}@fake.com`,
        role: "client",
        password: "12345678",
      }).then(user => user.newTurn({ branchId: 1, date: new Date().toISOString().slice(0, 10), time: `1${i}:30` }))
    })
  );

  console.log("Products Seed...");

  return Promise.all([users, branch]);
};

db.sync({ force: true })
  .then(setupSeed)
  .then(() => {
    console.log("Seed succesfully");
    process.exit(0);
  })
  .catch((err) => {
    console.log("Somethin went wrong on the seed process", err.message);
    process.exit(1);
  });