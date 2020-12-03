import { MapPlayer, SyncRequest } from "w3ts";
import { onMCCDetect, WebRequest } from "w3mcc";
import { Players } from "w3ts/globals";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";

function tsMain() {
  const syncRequests: SyncRequest[] = [];

  Players.forEach((p) => {
    syncRequests[p.id] = new SyncRequest(p).then((response) => {
      BJDebugMsg(`${p.name}: ${response.data} BTC is $1`);
    })
  })

  onMCCDetect(() => {
    print(`W3MCC Detected!`);

    const p = MapPlayer.fromLocal();

    new WebRequest(p, "GET", "https://blockchain.info/tobtc?currency=USD&value=1", (response) => {
      print(`Syncing response (${response.contents.length})....`);
      syncRequests[p.id].start(response.contents);
    });
  });
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);