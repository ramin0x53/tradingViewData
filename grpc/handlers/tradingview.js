const TVService = require("../../services/tradingview");
const Config = require("../../config");

module.exports = class TradingViewHandler {
    #tvService;

    constructor() {
        this.#tvService = new TVService({
            token: Config.TOKEN,
            signature: Config.SIGNATURE,
        });
    }

    getCandles = (call, callback) => {
        const name = call.request.name;
        callback(null, { message: `Hello, ${name}!` });
    };
}

