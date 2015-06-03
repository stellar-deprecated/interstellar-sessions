import {Module, Intent} from "interstellar-core";

const mod = new Module('interstellar-sessions');
export default mod;

mod.use(require('angular-cookies'));
mod.services = require.context("./services", true);

let registerBroadcastReceivers = (IntentBroadcast, Sessions) => {
  IntentBroadcast.registerReceiver(Intent.TYPES.LOGOUT, intent => {
    Sessions.destroyAll();
  });
};
registerBroadcastReceivers.$inject = ["interstellar-core.IntentBroadcast", "interstellar-sessions.Sessions"];
mod.run(registerBroadcastReceivers);

mod.define();

export * from "./errors";
