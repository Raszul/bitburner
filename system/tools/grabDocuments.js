/** @param {NS} ns */
export async function main(ns) {
	function determineNetwork(start = 'home', scannedServers = ['home']) {

		var foundServers = ns.scan(start);
		for (var server of foundServers) {
			if (scannedServers.includes(server)) continue;

			scannedServers.push(server);
			var receivedServers = determineNetwork(server, scannedServers);
			for (var subServer of receivedServers) {
				if (scannedServers.includes(subServer)) continue;
				scannedServers.push(subServer);
			}
		}

		return scannedServers;
	}

	function findLitFiles(network) {
		var literature = [];
		var scannedServers = [];

		for (var server of network) {
			if (scannedServers.includes(server)) continue;
			if ('home' == server) continue;

			scannedServers.push(server);
			var foundLiterature = ns.ls(server, '.lit');
			
			if (0 == foundLiterature.length) continue;

			var lit = [];
			for(var file of foundLiterature) {
				if ('/scripts/helpers/grow.js' == file) continue;
				if ('/scripts/helpers/hack.js' == file) continue;
				if ('/scripts/helpers/weaken.js' == file) continue;
				if ('/scripts/helpers/share.js' == file) continue;

				if(homeLiterature.includes(file)) continue;

				lit.push(file);
			}

			if(lit.length == 0) continue;
			
			literature.push([server, lit]);
		}

		return literature;
	}

	var homeLiterature = ns.ls('home', '.lit')
	var network = determineNetwork();
	var literature = findLitFiles(network);
	
	for(var litServer of literature) {
		var server = litServer[0];
		for (var lit of litServer[1]) {
			ns.scp(lit, 'home', server);
		}
	}
}