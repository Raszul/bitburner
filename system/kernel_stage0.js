import MyGameStage from "./library/stage";

/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        // move to the next stage as appropriate
        var gameStage = new MyGameStage(ns);
        const stage = 0;
        if(stage < gameStage.evaluateStage()) {
            gameStage.endStage(stage);
            gameStage.nextStage();
            return;
        }

        await ns.sleep(1000);
    }
}