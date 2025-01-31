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

    getCandles = async (call, callback) => {
        let candles = [];
        try {
            const { symbol, timeFrame, to, range } = call.request;
            candles.push(
                ...await this.#tvService.getCandles(symbol, timeFrame, range, to)
            );
        } finally {
            callback(null, { candles });
        }
    };
};
