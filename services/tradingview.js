const TradingView = require("@mathieuc/tradingview");

module.exports = class TVExtractor {
    #client;

    constructor(options) {
        this.#client = new TradingView.Client(options);
    }

    async getMarketData(timeZone, symbol, options) {
        const chart = new client.Session.Chart();
        chart.setTimezone(timeZone);

        chart.setMarket(symbol, options);

        const result = {};

        result.infos = await this.#getInfos(chart);
        result.periods = await this.#getPeriods(chart);

        return result;
    }

    #getInfos(chart) {
        return new Promise((resolve, reject) => {
            chart.onSymbolLoaded(() => {
                resolve(chart.infos);
            });
            chart.onError((error) => {
                reject(error);
            });
        });
    }

    #getPeriods(chart) {
        return new Promise((resolve, reject) => {
            chart.onUpdate(() => {
                resolve(chart.periods);
            });
            chart.onError((error) => {
                reject(error);
            });
        });
    }
}
