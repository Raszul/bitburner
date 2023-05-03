/** @param {NS} ns
 *
 *  @RAM: 1.75 GB
 *  @Version: 2.0.0
 *  @Author: Raszul
 **/

const RUNTIME_MULTIPLIER = 3.2;

export async function main(ns) {
	var targetServer = ns.args[0];
	var targetTime = ns.args[1];
	var hackTime = ns.args[2];

	var runtime = hackTime * RUNTIME_MULTIPLIER;

	if (targetTime) {
		var currentTime = performance.now();
		await ns.sleep(targetTime - currentTime - runtime);
	}
	await ns.hack(targetServer);
}