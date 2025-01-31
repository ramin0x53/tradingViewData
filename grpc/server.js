const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const TradingviewHandlers = require("./handlers/tradingview");
const PROTO_PATH = __dirname + "/protos/tradingview.proto";
const Reflection = require("@grpc/reflection")

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

module.exports = class GrpcServer {
    #server;
    #listenAddr;
    #tvHandler;

    constructor(addr) {
        this.#server = new grpc.Server();
        this.#listenAddr = addr;
        this.#tvHandler = new TradingviewHandlers();
    }

    get listenAddr() {
        return this.#listenAddr;
    }

    start() {
        const reflection = new Reflection.ReflectionService(packageDefinition);
        reflection.addToServer(this.#server, protoDescriptor);
        this.#addServices();
        this.#server.bindAsync(
            this.#listenAddr,
            grpc.ServerCredentials.createInsecure(),
            () => {
                console.log(`gRPC server running at ${this.#listenAddr}`);
            }
        );
    }

    #addServices() {
        this.#server.addService(protoDescriptor.Tradingview.service, {
            GetCandles: this.#tvHandler.getCandles,
        });
    }
};
