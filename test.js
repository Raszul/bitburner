import * as FUNDS from './scripts/library/reservedFunds.js';

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

//**
	var crimeTypes = Object.values(ns.enums.CrimeType);
	var crimes = [];
	var playerObj = ns.getPlayer();

	for (var crime of crimeTypes) {
		var gains = ns.formulas.work.crimeGains(playerObj, crime);
		var chance = ns.formulas.work.crimeSuccessChance(playerObj, crime);

		crimes.push([crime, gains.money*chance]);
	}

	crimes.sort((a, b) => b[1]-a[1]);

	ns.clearLog();
	for(var crime of crimes) {
		ns.print(crime[0] + ': $'+ns.formatNumber(crime[1]));
	}// */

	//ns.tprint(ns.getPurchasedServers());
}