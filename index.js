const GrpcServer = require("./grpc/server");
const Config = require("./config");

const gServer = new GrpcServer(Config.ADDR);

gServer.start();