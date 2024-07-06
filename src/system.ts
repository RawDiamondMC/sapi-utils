import { system, WatchdogTerminateBeforeEvent } from "@minecraft/server";

let watchdogDisabled: boolean = false;
/**
 * @internal
 * Initialize watchdog listener
 */
export function initWatchdogListener() {
  system.beforeEvents.watchdogTerminate.subscribe(
    (event: WatchdogTerminateBeforeEvent) => {
      event.cancel = watchdogDisabled;
    },
  );
}

/**
 * Enable Watchdog.
 */
export function enableWatchdog() {
  watchdogDisabled = false;
}

/**
 * Disable Watchdog.
 */
export function disableWatchdog() {
  watchdogDisabled = true;
}
