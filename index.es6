import {Module, Intent} from "interstellar-core";

const mod = new Module('interstellar-sessions');
export default mod;

mod.use(require('angular-cookies'));
mod.services    = require.context("./services", true);
mod.define();

export * from "./errors";
