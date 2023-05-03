/** @param {NS} ns
 *  
 *  @RAM: 3.35 GB
 *  @Version: 2.1.0
 *  @Author: Raszul
 **/
export async function main(ns) {
	function getAvailableRam() {
		return ns.getServerMaxRam('home') - ns.getServerUsedRam('home');
	}

	function detectReset() {
		return !ns.hasRootAccess('n00dles');
	}

	ns.disableLog('getScriptRam');
	ns.disableLog('getServerMaxRam');
	ns.disableLog('getServerUsedRam')
	ns.disableLog('sleep');
	ns.disableLog('run');
	ns.clearLog();

	const HOME_RAM_TO_KEEP_FREE = 32;
	const FILE_REQUIRED_FUNDS = '/data/requiredFunds.txt';

	ns.tail();
	ns.print("booting ...");
	const SCRIPT_MANAGER_HACK = '/scripts/manager_hack.js';
	const SCRIPT_MANAGER_HACKNET = '/scripts/manager_hacknet.js';
	const SCRIPT_MANAGER_SERVERFARM = '/scripts/manager_serverfarm.js';
	const SCRIPT_MANAGER_EXPLOITS = '/scripts/manager_exploits.js';
	const SCRIPTS_UTILITY = [
		'/scripts/ui_hackingTarget.js',
		'/scripts/ui_overview.js'
	];


	//update scripts
	//ns.print("updating scripts ...");
	//await ns.wget('https://pastebin.com/raw/w2an6TcB', SCRIPT_MANAGER_HACK);
	//await ns.wget('https://pastebin.com/raw/SA9eP15b', SCRIPT_MANAGER_HACKNET);
	//await ns.wget('https://pastebin.com/raw/R0G0Gqd0', SCRIPT_MANAGER_SERVERFARM);
	//await ns.wget('https://pastebin.com/raw/drwugGen', SCRIPT_MANAGER_EXPLOITS);
	//await ns.wget('https://pastebin.com/raw/NBCg6AEx', '/scripts/helpers/hack.js'); //done
	//await ns.wget('https://pastebin.com/raw/fLCZ70iU', '/scripts/helpers/grow.js'); //done
	//await ns.wget('https://pastebin.com/raw/LF8EgZHG', '/scripts/helpers/weaken.js'); //done
	//await ns.wget('https://pastebin.com/raw/ChHXbnHh', '/scripts/helpers/stealCash.js'); //placeholder until exploits manager is using batch hacking

	//detect reset / new game
	if (detectReset()) {
		ns.print("reset detected. initiliazing ...");
		
		ns.write(FILE_REQUIRED_FUNDS, 0, 'w');
		ns.write('/data/list_hackedServers.txt', '', 'w');
		ns.nuke('foodnstuff');
		ns.clearPort(1);
		ns.writePort(1, 'foodnstuff');
	} else if (!ns.serverExists(ns.peek(1))) {
		ns.clearPort(1);
		ns.writePort(1, 'foodnstuff');
	}

	//automate server hacking and money stealing
	ns.print("starting hacking manager ...");
	if (!ns.isRunning(SCRIPT_MANAGER_HACK)) {
		ns.run(SCRIPT_MANAGER_HACK);
		ns.tail(SCRIPT_MANAGER_HACK, 'home');
	} else {
		ns.print("    already running. skipped.");
	}

	//automate hacknet expansion
	ns.print("starting hacknet manager ...");
	if (!ns.isRunning(SCRIPT_MANAGER_HACKNET)) {
		if (ns.getScriptRam(SCRIPT_MANAGER_HACKNET) < getAvailableRam()) {
			ns.run(SCRIPT_MANAGER_HACKNET);
			ns.tail(SCRIPT_MANAGER_HACKNET, 'home');
		} else {
			ns.print("    not enough RAM. skipped.");
		}
	} else {
		ns.print("    already running. skipped.");
	}

	//automate exploitaton of hacked servers
	ns.print("starting exploits manager ...");
	if (!ns.isRunning(SCRIPT_MANAGER_EXPLOITS)) {
		if (ns.getScriptRam(SCRIPT_MANAGER_EXPLOITS) < getAvailableRam()) {
			ns.run(SCRIPT_MANAGER_EXPLOITS);
			ns.tail(SCRIPT_MANAGER_EXPLOITS, 'home');
		} else {
			ns.print("    not enough RAM. skipped.");
		}
	} else {
		ns.print("    already running. skipped.");
	}

	//automate server farm expansion
	ns.print("starting serverfarm manager ...");
	if (!ns.isRunning(SCRIPT_MANAGER_SERVERFARM)) {
		if (ns.getScriptRam(SCRIPT_MANAGER_SERVERFARM) < getAvailableRam()) {
			ns.run(SCRIPT_MANAGER_SERVERFARM);
			ns.tail(SCRIPT_MANAGER_SERVERFARM, 'home');
		} else {
			ns.print("    not enough RAM. skipped.");
		}
	} else {
		ns.print("    already running. skipped.");
	}

	//launch utility scripts
	ns.print("starting utility scripts:");
	var script = '';
	for (var i = 0; i < SCRIPTS_UTILITY.length; i++) {
		script = SCRIPTS_UTILITY[i];
		ns.print("    starting script '" + script + "'");
		if (!ns.isRunning(script)) {
			if (ns.getScriptRam(script) < getAvailableRam()) {
				if (ns.fileExists(script)) {
					ns.run(script);
					ns.tail(script, 'home');
				} else {
					ns.print("    script not found. skipped.");
				}
			} else {
				ns.print("    not enough RAM. skipped.");
			}
		} else {
			ns.print("    already running. skipped.");
		}
	}

	ns.print(" ");
	ns.print("boot complete.");
}