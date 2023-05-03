import * as RZL_CONSTANTS from '/scripts/library/constants.js';

/** @param {NS} ns */
export async function main(ns) {

	function updateStockData() {
		var tickers = ns.stock.getSymbols();
		var stocks = [];

		for (var ticker of tickers) {
			stocks.push([
				ticker, //which corp
				ns.stock.getForecast(ticker), //how ist it doing
				0, //ns.stock.getVolatility(ticker), //how likely is that to change
				ns.stock.getAskPrice(ticker), //how much it costs
				ns.stock.getBidPrice(ticker), //what it sells for
				ns.stock.getPosition(ticker) //how much we have
			]);
		}

		return stocks;
	}

	function displayStockData(stockData) {
		// make a table
		// TICKER - FORECAST - POS - ACTION

		ns.print("[ TICK ] [ CAST ] [ POSTION ] [ ACT ]");

		for (var position of stockData) {
			var act = "-";
			if (position[1] >= RZL_CONSTANTS.STOCK_FORECAST_BUY_LONG) act = 'BUY';
			if (position[1] <= RZL_CONSTANTS.STOCK_FORECAST_SELL_LONG) act = 'SELL';

			var padding = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        '];

			var message = padding[2]
						+ position[0] + padding[6 - position[0].length] + " "
						+ padding[2] + ns.formatPercent(position[1], 1) + padding[6 - ns.formatPercent(position[1], 1).length]+ " "
						+ padding[5 - ns.formatNumber(position[5][0] * position[4], 0).length] +"$"+ ns.formatNumber(position[5][0] * position[4], 2);

			message += padding[29-message.length] + " "
					+ padding[2] + act;

			ns.print(message);



		}
	}

	ns.disableLog('ALL');
	ns.clearLog();

	var act = 0;
	while (true) {
		ns.print("Stockmarket Manager " + RZL_CONSTANTS.ACTIVITY_INDICATOR[act]);
		ns.print(" ");

		var stockData = [];
		stockData = updateStockData();

		stockData.sort((a, b) => b[1] - a[1]);

		displayStockData(stockData);

		for (var position of stockData) {
			if (RZL_CONSTANTS.STOCK_FORECAST_SELL_LONG >= position[1]) {
				ns.stock.sellStock(position[0], position[5][0]);
			}

			if (RZL_CONSTANTS.STOCK_FORECAST_BUY_LONG < position[1]) {
				var amountAvailable = Math.max(0, ns.stock.getMaxShares(position[0]) - position[5][0]);
				var cashAvailable = ns.getServerMoneyAvailable('home');
				var amountAffordable = Math.floor(cashAvailable / position[3])
				var amountToBuy = Math.min(amountAvailable, amountAffordable);

				ns.stock.buyStock(position[0], amountToBuy);
			}

		}

		act++;
		act = act % RZL_CONSTANTS.ACTIVITY_INDICATOR.length;

		await ns.sleep(1000);
		ns.clearLog();
	}
}