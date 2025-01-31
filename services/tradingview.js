const TradingView = require("@mathieuc/tradingview");
const Config = require("../config");

module.exports = class TVExtractor {
    #client;

    constructor(options) {
        this.#client = new TradingView.Client(options);
    }

    convertTf(timeFrame) {
        switch (timeFrame) {
            case "1m":
                return "1";
            case "3m":
                return "3";
            case "5m":
                return "5";
            case "15m":
                return "15";
            case "30m":
                return "30";
            case "45m":
                return "45";
            case "1h":
                return "60";
            case "2h":
                return "120";
            case "3h":
                return "180";
            case "4h":
                return "240";
            case "1d":
                return "1D";
            case "1W":
                return "1W";
            case "1M":
                return "M";
            case "D":
                return "D";
            case "W":
                return "W";
            case "M":
                return "M";
            default:
                throw new Error("wrong timeFrame");
        }
    }

    async getCandles(symbol, timeFrame, range, to, timeZone = Config.TIMEZONE) {
        const tf = this.convertTf(timeFrame);
        const data = await this.getMarketData(timeZone, symbol.toUpperCase(), {
            timeframe: tf,
            range: range ? Number(range) : undefined,
            to: to ? Number(to) : undefined,
        });
        const candles = [];
        for (const candle of data.periods) {
            candles.push({
                time: candle.time,
                open: candle.open,
                high: candle.max,
                low: candle.min,
                close: candle.close,
                volume: candle.volume,
            });
        }
        return candles;
    }

    async getMarketData(timeZone, symbol, options) {
        const chart = new this.#client.Session.Chart();
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
};
