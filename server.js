const express = require('express');
const helmet = require('helmet');

const server = express();

server.use(helmet());

server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.use((req, res, next) => {
  console.log(`${Date().split(" ")[4]}: ${req.method} Request: ${req.originalUrl}`);
  next();
}); 

server.get("/", (req, res) => {
  res.send("Welcome");
});

server.listen(3000, () => {
  console.log("Server online");
});
