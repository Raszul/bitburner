import * as FUNDS         from '/scripts/library/reservedFunds.js';
import * as RZL_CONSTANTS from '/scripts/library/constants.js';

/** @param {NS} ns
 *  
 *  @RAM: 5.95 GB
 *  @Version: 2.1.0
 *  @Author: Raszul
 **/
export async function main(ns) {
    async function buyNodeAction() {
        var result = false;

        result = ns.hacknet.purchaseNode();
        ns.print("Purchased hacknet node #" + result + ".");
    }

    async function upgadeLevelAction(index) {
        //upgrade node level
        ns.hacknet.upgradeLevel(index, 1);
        ns.print("Node #" + index + " upgraded to level " + ns.hacknet.getNodeStats(index).level + ".");
    }

    async function upgradeRamAction(index) {
        //upgrade node level
        ns.hacknet.upgradeRam(index, 1);
        ns.print("Node #" + index + " RAM increased to " + ns.hacknet.getNodeStats(index).ram + " GB.");
    }

    async function upgradeCoreAction(index) {
        //upgrade node level
        ns.hacknet.upgradeCore(index, 1);
        ns.print("Node #" + index + " Core count increased to " + ns.hacknet.getNodeStats(index).cores + ".");
    }

    function getProduction(level, ram, cores) {
        return (level * 1.5) * Math.pow(1.035, ram - 1) * ((cores + 5) / 6);
    }

    function displayStatus() {
        ns.clearLog();
        ns.print("Income:      $" + ns.formatNumber(income));
        ns.print("Buffer:      $" + ns.formatNumber(FUNDS.getCashThreshold(ns)));
        ns.print("Req. Funds:  $" + ns.formatNumber(FUNDS.getReservedFunds(ns)));
        ns.print("Action Cost: $" + ns.formatNumber(actionCost));
        if (-1 == actionNodeIndex) {
            ns.print("Action Type: " + action);
        } else {
            ns.print("Action Type: " + action + " on Node #" + actionNodeIndex);
        }
        ns.print(" ");
    }

    const PROD_MULTIPLIER = ns.getHacknetMultipliers().production;

    ns.disableLog('ALL');
    ns.clearLog();

    while (true) {
        //determine cheapest action
        var action = "buyNode";
        var actionCost = ns.hacknet.getPurchaseNodeCost();
        var newNodeCost = actionCost;
        var actionRatio = 0;
        var actionNodeIndex = -1;

        if(ns.hacknet.numNodes() >= 30) newNodeCost = Infinity;

        var income = 0;

        //ns.print("buy cost: "+actionCost);
        for (var nodeIndex = 0; nodeIndex < ns.hacknet.numNodes(); nodeIndex++) {
            var nodeStats = ns.hacknet.getNodeStats(nodeIndex);

            var costUpgrade = ns.hacknet.getLevelUpgradeCost(nodeIndex, 1);

            var costRam = ns.hacknet.getRamUpgradeCost(nodeIndex, 1);
            var costCore = ns.hacknet.getCoreUpgradeCost(nodeIndex, 1);

            var levelUpgradeRatio = ((getProduction(nodeStats.level + 1, nodeStats.ram, nodeStats.cores) * PROD_MULTIPLIER) - nodeStats.production) / costUpgrade;
            var ramUpgradeRatio = ((getProduction(nodeStats.level, nodeStats.ram * 2, nodeStats.cores) * PROD_MULTIPLIER) - nodeStats.production) / costRam;
            var coreUpgradeRatio = ((getProduction(nodeStats.level, nodeStats.ram, nodeStats.cores + 1) * PROD_MULTIPLIER) - nodeStats.production) / costCore;

            income += nodeStats.production;

            if (levelUpgradeRatio > actionRatio) {
                action = "upgradeLevel";
                actionNodeIndex = nodeIndex;
                actionCost = costUpgrade;
                actionRatio = levelUpgradeRatio;
            }

            if (ramUpgradeRatio > actionRatio) {
                action = "upgradeRam";
                actionNodeIndex = nodeIndex;
                actionCost = costRam;
                actionRatio = ramUpgradeRatio;
            }

            if (coreUpgradeRatio > actionRatio) {
                action = "upgradeCore";
                actionNodeIndex = nodeIndex;
                actionCost = costCore;
                actionRatio = coreUpgradeRatio;
            }
        }

        FUNDS.updateCashThreshold(ns, Math.max(income * RZL_CONSTANTS.CASH_THRESHOLD_INCOME_MULTIPLIER));

        if( actionCost > newNodeCost ) {
            actionCost = newNodeCost;
            action = "buyNode";
        }

        displayStatus();
        //wait for cash
        if (FUNDS.getAvailableMoney(ns) < actionCost) ns.print("waiting for money ...");
        while (FUNDS.getAvailableMoney(ns) < actionCost) {
            await ns.sleep(100);
        }


        if (Infinity == actionCost) {
            ns.toast("Hacknet fully upgraded.", "success");
            break;
        }

        //execute cheapest action
        switch (action) {
            case "buy":
                await buyNodeAction();
                break;
            case "upgradeLevel":
                await upgadeLevelAction(actionNodeIndex,);
                break;
            case "upgradeRam":
                await upgradeRamAction(actionNodeIndex);
                break;
            case "upgradeCore":
                await upgradeCoreAction(actionNodeIndex);
                break;
            default:
                await buyNodeAction();
                break;
        }

        //break;
        await ns.sleep(10);
    }
}