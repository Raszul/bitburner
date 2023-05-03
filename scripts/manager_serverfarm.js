import * as FUNDS from '/scripts/library/reservedFunds.js';

/** @param {NS} ns 
 *  
 *  @RAM: 13.50 GB
 *  @Version: 3.0.0
 *  @Author: Raszul
 **/
export async function main(ns) {
	function getNextServerName() {
		var serverCount = ns.getPurchasedServers().length;
		if (10 > serverCount) {
			return SERVER_PREFIX + "-0" + serverCount;
		} else {
			return SERVER_PREFIX + "-" + serverCount;
		}
	}
	function getServerName(serverIndex) {
		if (10 > serverIndex) {
			return SERVER_PREFIX + "-0" + serverIndex;
		} else {
			return SERVER_PREFIX + "-" + serverIndex;
		}
	}

	function deleteFarmServer(serverIndex) {
		var server = ns.getPurchasedServers()[serverIndex];
		ns.killall(server);
		ns.deleteServer(server);
	}

	function buyServer(serverName, ram) {

		ns.print("    buying server " + serverName + "...");
		ns.purchaseServer(serverName, ram);

		ns.print("    purchase complete.");
	}

	function updateServerName(serverIndex) {
		var currentName = ns.getPurchasedServers()[serverIndex];
		var newName = getServerName(serverIndex);

		if (currentName == newName) return;

		ns.renamePurchasedServer(currentName, newName);
	}

	const SERVER_PREFIX = "SERVER";
	const SERVER_LIMIT = ns.getPurchasedServerLimit();

	ns.disableLog('ALL');
	ns.clearLog();

	//get existing servers up and running
	ns.print("Initializing Server Farm:");
	for (var a = 0; a < ns.getPurchasedServers().length; a++) {
		ns.print("  initializing server " + ns.getPurchasedServers()[a] + "...");
		updateServerName(a)
	}
	if (ns.getPurchasedServers().length > 0) updateServerName(0);
	ns.print(" ");

	//fill up server limit
	ns.print("Expanding Server Farm:");
	while (ns.getPurchasedServers().length < SERVER_LIMIT) {
		ns.print("  waiting for money to buy server... $" + ns.formatNumber(FUNDS.getAvailableMoney(ns)) + "/" + ns.formatNumber(ns.getPurchasedServerCost(16)));
		while (ns.getPurchasedServerCost(16) > ns.getServerMoneyAvailable('home')) {
			await ns.sleep(1000);
		}

		ns.print("  buying server # " + (ns.getPurchasedServers().length + 1) + "...");
		buyServer(SERVER_PREFIX, 16);
	}
	ns.print(" ");

	ns.toast("Server Farm has reached maximum server count.", "info");

	//upgrade servers whenever we have the money to upgrade them all
	while (true) {
		ns.print("Managing Server Farm:");

		ns.print("  determining best server to upgrade...");
		var upgradeCost = ns.getPurchasedServerCost(2 * ns.getServerMaxRam(ns.getPurchasedServers()[0]));
		var upgradeIndex = 0;

		var serverList = ns.getPurchasedServers();
		for (var a = 0; a < serverList.length; a++) {
			var currentRam = ns.getServerMaxRam(serverList[a]);

			if (ns.getPurchasedServerCost(currentRam * 2) < upgradeCost) {
				upgradeCost = ns.getPurchasedServerCost(currentRam * 2);
				upgradeIndex = a;
			}
		}

		if (Infinity == upgradeCost) {
			ns.toast("Server Farm reached its maximum potential.", "success");
			break;
		}

		ns.print("  upgrade cost: $" + ns.formatNumber(upgradeCost) + "...");
		ns.print("  cash buffer:  $" + ns.formatNumber(FUNDS.getCashThreshold(ns)) + "...");
		ns.print(" ");
		ns.print("  waiting for money ...");
		while (FUNDS.getAvailableMoney(ns) < upgradeCost) {
			await ns.sleep(1000);
		}

		ns.print("  upgrading server " + serverList[upgradeIndex] + "...");
		var currentRam = ns.getServerMaxRam(serverList[upgradeIndex]);
		var serverName = serverList[upgradeIndex];
		ns.print("    deleting server...");
		deleteFarmServer(upgradeIndex);
		ns.print("    getting "+ns.formatRam(currentRam*2)+" RAM...");
		buyServer(serverName, currentRam * 2);
		ns.print("  server upgraded.")
		ns.print(" ");

		await ns.sleep(250);
	}


	ns.print(" ");
	ns.print("All servers maxed out.");
}