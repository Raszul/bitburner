import * as RZL_CONSTANTS from '/scripts/library/constants.js';

/**
 * returns the amount of funds reserved by the player
 * prefered: use getCashThreshold() instead
 * not for direct use
 */
export function getReservedFunds(ns) {
	var reservedFunds = ns.peek(RZL_CONSTANTS.PORT_RESERVED_FUNDS);

	if (isNaN(reservedFunds)) {
		reservedFunds = 0;
	} else {
		reservedFunds *= 1;
	}
	return reservedFunds;
}

/**
 * reserves a certain amount of funds so scripts don't spend it
 */
export function setReservedFunds(ns, reservedFunds) {
	if (isNaN(reservedFunds)) return false;

	ns.clearPort(RZL_CONSTANTS.PORT_RESERVED_FUNDS);
	ns.writePort(RZL_CONSTANTS.PORT_RESERVED_FUNDS, reservedFunds);

	return true;
}

/**
 * returns the current min chash threshold
 * not meant for direct use
 */
export function getMinCashThreshold(ns) {
	var minCashThreshold = ns.peek(RZL_CONSTANTS.PORT_CASH_THRESHOLD);

	if (isNaN(minCashThreshold)) {
		return 0;
	} else {
		minCashThreshold *= 1;
	}

	return minCashThreshold;
}

/**
 * overwrites the current min cash threshold
 * prefered: use updateCashThreshold() instead
 * use with care
 */
export function setMinCashThreshold(ns, minCashThreshold) {
	if (isNaN(minCashThreshold)) return false;

	ns.clearPort(RZL_CONSTANTS.PORT_CASH_THRESHOLD);
	ns.writePort(RZL_CONSTANTS.PORT_CASH_THRESHOLD, minCashThreshold);

	return true;
}

/**
 * sets the min cash threshold to be the higher of what it is and the new suggestion
 */
export function updateCashThreshold(ns, suggestedCashThreshold) {
	if (isNaN(suggestedCashThreshold)) return false;

	return setMinCashThreshold(ns, Math.max(suggestedCashThreshold, getMinCashThreshold(ns)));

}

/**
 * gets the higher of the player-reserved funds and the current min cash threshold
 */
export function getCashThreshold(ns) {
	return Math.max(getReservedFunds(ns), getMinCashThreshold(ns));
}

/**
 * returns the amount of funds availble for spending by scripts
 */
export function getAvailableMoney(ns) {
	return Math.floor(Math.max(0, ns.getServerMoneyAvailable('home') - getCashThreshold(ns)));
}