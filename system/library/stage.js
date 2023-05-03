import MyConstants from "./constants";

export default class MyGameStage {
    /** @param {NS} ns **/
    constructor(ns) {
        this.ns = ns;
        this.CONSTS = new MyConstants(ns);
    }

    evaluateStage() {
        var stage = 0;
        /**
         * STAGE 0
         * 
         * Objectives:
         *     - get BruteSSH.exe
         *     - get 32 GB RAM on 'home'
         *     - get thor access
         *     - get 50mil cash
         * 
         * Info:
         *     - start exploiting task //this uses./system/tools/BasicHack.js to rob all accessible servers blind; ideally without reducing them to 0 cash in the process.
         *     - periodically run hacking task
         *     - periodically run serverfarm task
         * 
         * This stage is about quickly grabbing some cash and key elements, not sustainability.
         */
        var homeRam = ns.getServerMaxRam('home');
        if (32 > homeRam) return stage;

        var cash = ns.getServerMoneyAvailable('home');
        if (50 * 1000 * 1000 > cash) return stage;

        var hackToolCount = 0;
        for (var tool in CONSTS.HACKING_TOOLS) {
            if (ns.fileExists(tool + '.exe')) hackToolCount++;
        }
        if (1 > hackToolCount) return stage;

        if (!ns.hasTorRouter()) return stage;


        stage = 1;
        /**
         * STAGE 1
         * 
         * Objectives:
         *     - get FTPCrack.exe
         *     - get relaySMTP.exe
         *     - get 25 servers
         *     - get 1bil cash
         *     - get 1TB RAM on 'home'
         * 
         * Info:
         *     - stop exploiting task
         *     - start exploiting task #1 //this hacks available targets in a sustainable manner
         *     - start money management task
         *     - periodically run hacknet task
         *     - periodically run stockmarket task
         * 
         * This 
         */

        if (Math.pow(2, 10) > homeRam) return stage;
        if (1 * 1000 * 1000 * 1000 > cash) return stage;
        if (3 > hackToolCount) return stage;

        var serverFarmSize = 0;
        for (var c = 0; c < 25; c++) {
            var serverName = 'SERVER-' + c;

            if (ns.serverExists(serverName)) serverFarmSize++;
        }

        if (25 >= serverFarmSize) return stage;

        //stage = 2;
        /**
         * STAGE 2
         * 
         * No clue what to do in this stage yet.
         * Running a Gang or a Corporation maybe? whatever the next step might be I haven't unlocked it yet
         * without a money manager this was the stage where i started on the stockmarket
         * but with one? with one i can balance expenditures for different systems against each other and thus don't need to worry about the stockmarket hogging all the cash.
         */

        return stage;
    }

    endStage(stage) {

    }

    nextStage() {

    }
}