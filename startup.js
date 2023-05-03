import MyGameStage from "system/library/stage";

/** 
 * @param {NS} ns
 * 
 * @RAM 2.40 GB
 * @Version 1.0
 * @Author Raszul
 * 
 * This script initializes my OS/script collection.
 * It updates the updater, quits, lets the upater update the OS/script collecton and resume the boot.
 * The resumed boot then detects if there was a reset and if so, re-initializes the environment (e.g. hacks 0-port servers).
 * Then the script determines the current stage and runs the appropriate kernel version.
 * The kernels then handle stage appropriate tasks and switch to the next stage once the appropriate conditions have been met.
 **/
export async function main(ns) {
    const GAMESTAGE = new MyGameStage(ns);

    function detectReset() {
        return !ns.hasRootAccess('foodnstuff');
    }

    function hackLocalNetwork() {
        var targets = ns.scan();
        for (var target in targets) {
            if (ns.hasRootAccess(target)) continue;

            try {
                ns.nuke(target);
            } catch (e) { };
        }
    }

    /**
     * SEMI-CODE
     * 
     * if no args
     *     update updater
     *     run updater
     *     close
     * else
     *     if reset
     *         hack 0-port servers
     *     detect stage
     *      
     *     run kernel stage
     */

    /** disabled until the required files are on github
    if(0 == ns.args.length) {
        await ns.wget(); //update updater
        ns.exec(); //run updater
        return; //stop booting
    }// */

    if (detectReset()) {
        hackLocalNetwork();
    }
    var currentStage = GAMESTAGE.

    ns.exec('./system/kernel_stage'+currentStage+'.js');
}