const express = require("express");
const server = express();

server.use(express.json());

const users = ["Diego", "Robson", "Victor"];

// Log middleware
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Method: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

// Validation body middleware
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

// Validation index middleware
function checkUserIndexExists(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  // Adds variable to the requisition so it can be used on the next flow
  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserIndexExists, (req, res) => {
  const { index } = req.params;

  return res.json(users[index]);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserIndexExists, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  return res.json(users);
});

server.delete("/users/:index", checkUserIndexExists, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

server.listen(3000);
