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
    email: "user@fake.com",
    role: "client",
    password: "12345678",
  },
];
const branchList = [
  {
    name: "SUCURSAL A",
    coords: "-90.000, -180.0000",
    maxPerTurn: 1,
    turnRange: JSON.stringify({ open: 10, close: 14 }),
  },
  {
    name: "SUCURSAL B",
    coords: "-90.000, -180.0000",
    maxPerTurn: 2,
    turnRange: JSON.stringify({ open: 9, close: 13 }),
  },
  {
    name: "SUCURSAL C",
    coords: "-90.000, -180.0000",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL D",
    coords: "-90.000, -180.0000",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL E",
    coords: "-90.000, -180.0000",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL F",
    coords: "-90.000, -180.0000",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL G",
    coords: "-90.000, -180.0000",
    maxPerTurn: 4,
    turnRange: JSON.stringify({ open: 8, close: 12 }),
  },
  {
    name: "SUCURSAL H",
    coords: "-90.000, -180.0000",
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
  //const branch = await Branch.bulkCreate(branchList);

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