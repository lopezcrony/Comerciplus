require("dotenv").config();

const Server = require('./src');
const server = new Server();

server.listen();