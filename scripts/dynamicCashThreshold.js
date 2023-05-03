import * as FUNDS from '/scripts/library/reservedFunds.js';
import * as RZL_CONSTANTS from '/scripts/library/constants.js';

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	ns.clearLog();

	var lastScriptIncome = ns.getTotalScriptIncome()[1];
	while (true) {
		ns.print("Dynamic Cash Threshold");
		ns.print("  getting script income...");
		var thisScriptIncome = ns.getTotalScriptIncome()[1];
		var scriptIncome = Math.max(ns.getTotalScriptIncome()[0], thisScriptIncome-lastScriptIncome);
		lastScriptIncome = thisScriptIncome;
		var hacknetIncome = 0;
		
		ns.print("  getting hacknet income...");
		for(var n=0; n<ns.hacknet.numNodes(); n++) {
			var nodeStats = ns.hacknet.getNodeStats(n);
			hacknetIncome += nodeStats.production;
		}

		var totalIncome = Math.max(0,scriptIncome)+Math.max(0, hacknetIncome);
		var newThreshold = totalIncome*RZL_CONSTANTS.CASH_THRESHOLD_INCOME_MULTIPLIER;

		ns.print("  updating cash threshold...");
		FUNDS.updateCashThreshold(ns, newThreshold);

		ns.print(" ");
		ns.print("  script income:  $"+ns.formatNumber(scriptIncome));
		ns.print("  hacknet income: $"+ns.formatNumber(hacknetIncome));
		ns.print("  total income:   $"+ns.formatNumber(totalIncome));
		ns.print("  cash threshold: $"+ns.formatNumber(newThreshold));
		await ns.sleep(1000);
		ns.clearLog();
	}
}