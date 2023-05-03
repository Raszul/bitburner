/** @param {NS} ns */
export async function main(ns) {
	/**
	 * TODO:
	 * 	- 
	 */

	//var crimeTypes = Object.values(ns.enums.JobName);
	function showStatus(server, a) {
		ns.clearLog();
		ns.print("Server: " + server+" "+ACTIVITY_SYMBOL[a]);
		ns.print("  Security:");
		ns.print("    desired: " + ns.formatNumber(ns.getServerMinSecurityLevel(server)));
		ns.print("    current: " + ns.formatNumber(ns.getServerSecurityLevel(server)));
		ns.print("  Cash:");
		ns.print("    desired: $" + ns.formatNumber(ns.getServerMaxMoney(server)));
		ns.print("    current: $" + ns.formatNumber(ns.getServerMoneyAvailable(server)));
		ns.print(" ");
	}

	const ACTIVITY_SYMBOL = ['-','\\','|','/'];

	ns.disableLog('getServerMinSecurityLevel');
	ns.disableLog('getServerSecurityLevel');
	ns.disableLog('getServerMaxMoney');
	ns.disableLog('getServerMoneyAvailable');
	ns.disableLog('sleep');

	var a = 0;
	while (true) {
		var HACKING_TARGET = ns.peek(1);
		showStatus(HACKING_TARGET, a);
		await ns.sleep(100);

		a++;
		if (a>=ACTIVITY_SYMBOL.length) a=0;
	}
}