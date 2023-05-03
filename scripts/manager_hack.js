/** @param {NS} ns 
 *  
 *  @RAM: 2.35 GB
 *  @Version: 3.0.0
 *  @Author: Raszul
 **/
export async function main(ns) {
	function scanNetwork(server) {
		if (!ns.serverExists(server)) return false;

		var foundServers = ns.scan(server);
		var newServerFound = false;

		for (var a = 0; a < foundServers.length; a++) {
			//add server to known server list if unknown
			if (!knownServers.includes(foundServers[a])) {
				knownServers.push(foundServers[a]);
				newServerFound = true;
			}

			if (!hackedServers.includes(foundServers[a])) {
				if (ns.hasRootAccess(foundServers[a])) {
					//if we have already hacked it, add it to hacked servers if not already in there
					hackedServers.push(foundServers[a]);
					newServerFound = true;
				} else {
					//if we haven't hacked it, add it to the list of servers to hack if it isn't already in there
					if (!unhackedServers.includes(foundServers[a])) unhackedServers.push(foundServers[a]);
				}
			}
		}

		return newServerFound;
	}

	async function updateNetwork() {
		var scanRequired = true;

		while (scanRequired) {
			scanRequired = false;

			for (var a = 0; a < knownServers.length; a++) {
				scanRequired = scanRequired || scanNetwork(knownServers[a]);
			}

			await ns.sleep(20);
		}
	}


	// SSH?
	function hasHackSSH() {
		return ns.fileExists("BruteSSH.exe", "home");
	}
	async function runHackSSH(target) {
		if (!hasHackSSH()) return false;
		//if (ns.getServer(target).sshPortOpen) return true;

		ns.print("          opening SSH port ...");
		return ns.brutessh(target);
	}
	// FPT?
	function hasHackFTP() {
		return ns.fileExists("FTPCrack.exe", "home");
	}
	async function runHackFTP(target) {
		if (!hasHackFTP()) return false;
		//if (ns.getServer(target).ftpPortOpen) return true;

		ns.print("          opening FTP port ...");
		return ns.ftpcrack(target);
	}
	// SMTP?
	function hasHackSMTP() {
		return ns.fileExists("relaySMTP.exe", "home");
	}
	async function runHackSMTP(target) {
		if (!hasHackSMTP()) return false;
		//if (ns.getServer(target).smtpPortOpen) return true;

		ns.print("          opening SMPT port ...");
		return ns.relaysmtp(target);
	}
	// HTTP?
	function hasHackHTTP() {
		return ns.fileExists("HTTPWorm.exe", "home");
	}
	async function runHackHTTP(target) {
		if (!hasHackHTTP()) return false;
		//if (ns.getServer(target).httpPortOpen) return true;

		ns.print("          opening HTTP port ...");
		return ns.httpworm(target);
	}
	// SQL?
	function hasHackSQL() {
		return ns.fileExists("SQLInject.exe", "home");
	}
	async function runHackSQL(target) {
		if (!hasHackSQL()) return false;
		//if (ns.getServer(target).sqlPortOpen) return true;

		ns.print("            openingSQL port ...");
		return ns.sqlinject(target);
	}

	function updateToolCount() {
		var newToolCount = 0;
		var hasNewTool = false;

		if (hasHackSSH()) newToolCount++;
		if (hasHackFTP()) newToolCount++;
		if (hasHackSMTP()) newToolCount++;
		if (hasHackHTTP()) newToolCount++;
		if (hasHackSQL()) newToolCount++;

		if (newToolCount > toolCount) hasNewTool = true;
		toolCount = newToolCount;

		return hasNewTool;
	}

	async function hackServer(server) {
		var validServer = false;
		if (!ns.serverExists(server)) return false;

		ns.print('hacking ' + server);

		if (ns.hasRootAccess(server) && hackedServers.includes(server)) {
			//remove from unhacked servers
			if (unhackedServers.includes(server)) unhackedServers.splice(unhackedServers.indexOf(server), unhackedServers.indexOf(server));
			return false;
		}
		//make sure its in the known server list
		if (!knownServers.includes(server)) knownServers.push(server);

		//hack as many ports as we can
		await runHackSSH(server);
		await runHackFTP(server);
		await runHackSMTP(server);
		await runHackHTTP(server);
		await runHackSQL(server);

		//try to gain root access
		try {
			ns.nuke(server);
		} catch (error) { }
		await ns.sleep(20);

		//update server lists
		if (ns.hasRootAccess(server)) {
			//add to hacked servers
			if (!hackedServers.includes(server)) hackedServers.push(server);
			//remove from unhacked servers
			if (unhackedServers.includes(server)) unhackedServers.splice(unhackedServers.indexOf(server), unhackedServers.indexOf(server));
		} else {
			//add to unhacked servers
			if (!unhackedServers.includes(server)) unhackedServers.push(server);
			//remove from hacked servers
			if (hackedServers.includes(server)) hackedServers.splice(hackedServers.indexOf(server), hackedServers.indexOf(server));
		}

		return ns.hasRootAccess(server);
	}
	async function hackNetwork() {
		var hackedNewServer = false;
		var hasHackedNewServer = false;

		do {
			hackedNewServer = false;
			var targetList = unhackedServers;
			for (var a = 0; a < targetList.length; a++) {
				hackedNewServer = hackedNewServer || await hackServer(targetList[a]);
				hasHackedNewServer = hasHackedNewServer || hackedNewServer;
			}
			if (hackedNewServer) await updateNetwork();

			await ns.sleep(20);
		} while (hackedNewServer);

		return hasHackedNewServer;
	}

	function writeData() {
		ns.write('/data/list_hackedServers.txt', hackedServers.toString(), 'w');
	}
	
	const scriptCashSteal = '/scripts/helpers/stealCash.js';
	var knownServers = ['home'];
	var hackedServers = ['home'];
	var unhackedServers = [];
	var toolCount = 0;
	var cycles = 0;
	var newHackedServer = false;

	ns.disableLog('scan');
	ns.disableLog('sleep');
	ns.disableLog('getServerMaxRam');
	ns.disableLog('getServerUsedRam');
	ns.disableLog('getServerMaxMoney');
	ns.disableLog('hasRootAccess');
	ns.disableLog('nuke');
	ns.disableLog('brutessh');
	ns.disableLog('ftpcrack');
	ns.disableLog('relaysmtp');
	ns.disableLog('httpworm');
	ns.disableLog('sqlinject');

	ns.print('updating network ..');
	await updateNetwork();
	ns.print('hacking network ...');
	await hackNetwork();
	ns.print('writing data ...');
	writeData();

	while (true) {
		if (updateToolCount() || cycles > (10 * 60)) {
			cycles = 0;
			newHackedServer = false;

			ns.print('updating network ..');
			await updateNetwork();
			ns.print('hacking network ...');
			newHackedServer = await hackNetwork();
			if (newHackedServer) {
				ns.print('writing data ...');
				writeData();
			}
		}
		cycles++;

		//check for new tools once per minute;
		ns.print("waiting for next cycle.");
		await ns.sleep(1000);
	}
}