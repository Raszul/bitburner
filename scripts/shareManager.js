/** @param {NS} ns
 *  
 *  @Author: Raszul
 **/
export async function main(ns) {
	/**
	 * TODO:
	 * 	- 
	 */

	//var crimeTypes = Object.values(ns.enums.JobName);

	const SCRIPT_SHARE = '/scripts/helpers/share.js';
	const SCRIPT_SHARE_RAM = ns.getScriptRam(SCRIPT_SHARE);

	const RAM_PERCENTAGE_TO_USE = 0.25;

	ns.disableLog('ALL');
	ns.clearLog();

	while (true) {
		ns.clearLog();
		ns.print("assembling list of host servers ...");
		var hostServers = ['home'];

		ns.print("  adding purchased servers ...");
		for (var server of ns.getPurchasedServers()) {
			if (!hostServers.includes(server)
				&& ns.hasRootAccess(server)
				&& 0 < ns.getServerMaxRam(server)) {

				//add server to list of valid hosts.
				hostServers.push(server);
			}
		}

		ns.print("  adding hacked servers...");
		var hackedServers = ns.read('/data/list_hackedServers.txt').split(',').filter(s => ns.serverExists(s));
		for (var server of hackedServers) {
			if (!hostServers.includes(server)
				&& ns.hasRootAccess(server)
				&& 0 < ns.getServerMaxRam(server)) {

				//add server to list of valid hosts.
				hostServers.push(server);
			}
		}

		ns.print("  validating list...");
		var validHostServers = ['home'];
		for (var server of hostServers.filter(s => ns.serverExists(s))) {
			if (!validHostServers.includes(server)
				&& ns.getServerMaxRam(server) > 0
				&& ns.hasRootAccess(server)) {

				validHostServers.push(server);
			}
		}


		ns.print(" ");
		ns.print("sharing...");
		ns.print("  Servers:     " + validHostServers.length);
		ns.print("  Instances:   " + shareInstances);
		ns.print("  threads:     " + shareThreads);
		ns.print("  share power: " + ns.formatPercent(ns.getSharePower()));
		var shareInstances = 0;
		var shareThreads = 0;
		for (var host of validHostServers) {
			if (ns.isRunning(SCRIPT_SHARE, host)) continue;

			if (!ns.fileExists(SCRIPT_SHARE, host)) ns.scp(SCRIPT_SHARE, host, 'home');

			var ramAvailable = (ns.getServerMaxRam(host) * RAM_PERCENTAGE_TO_USE) - ns.getServerUsedRam(host);
			if ('home' == host) ramAvailable = ramAvailable - 32;
			var useThreads = Math.floor(ramAvailable / SCRIPT_SHARE_RAM);

			if (0 < useThreads) {
				ns.exec(SCRIPT_SHARE, host, useThreads);
				shareInstances++;
				shareThreads += useThreads;
			}
			await ns.sleep(1);
		}


		await ns.sleep(1050);
	}


	//ns.tprint();
}