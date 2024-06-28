import { Player, world } from "@minecraft/server";
import { requireNonNull } from "./misc";
import { getModName } from "./index";

/**
 * Get the current stack trace.
 */
export function getStackTrace(): string {
  return requireNonNull(Error().stack);
}

let logContent: string = "";

/**
 * Get the log history.
 */
export function getLogHistory() {
  return logContent;
}

/**
 * Add to the log history. \n will be automatically added.
 * @param log
 */
export function addToLogHistory(log: string) {
  return logContent;
}

export enum LogLevel {
  DEBUG = -1,
  INFO,
  WARN,
}

function setWorldLogLevel(level: LogLevel) {
  world.setDynamicProperty("loglevel", level);
}

function getWorldLogLevel(): LogLevel {
  return <LogLevel>world.getDynamicProperty("loglevel");
}

function getPlayersByLoglevel(level: LogLevel) {
  let players: Player[] = world.getPlayers();
  players = players.filter(
    (player: Player) =>
      <LogLevel>player.getDynamicProperty("loglevel") <= level,
  );
  return players;
}

function sendMessage(message: string, level: LogLevel) {
  if (level < getWorldLogLevel()) {
    getPlayersByLoglevel(level).forEach((player: Player) => {
      player.sendMessage(message);
    });
  } else {
    world.sendMessage(message);
  }
}

export class Logger {
  private readonly id: string;
  private readonly feedback: string | undefined;

  private constructor(id: string, feedback?: string) {
    this.id = id;
    this.feedback = feedback;
  }

  /**
   * Get a new Logger
   * @param id if it's not set, the value will be te result of the `getModName()`.
   * @param feedback the info which will be sent when an error or a fatal error.
   */
  static getLogger(id?: string, feedback?: string): Logger {
    return new Logger(id ?? getModName(), feedback);
  }

  /**
   * Set player(or the world)'s LogLevel.
   * @param level
   * @param player
   */
  setLogLevel(level: LogLevel, player?: Player): void {
    if (player !== undefined) {
      player.setDynamicProperty("loglevel", level);
      return;
    }
    setWorldLogLevel(level);
  }

  /**
   * Get player(or the world)'s LogLevel.
   * @param player
   */
  getLogLevel(player?: Player): LogLevel {
    if (player !== undefined) {
      return <LogLevel>player.getDynamicProperty("loglevel") ?? 0;
    }
    return getWorldLogLevel();
  }

  /**
   * The `log()` function is an alias for {@link info}.
   * @param message
   * @param players
   */
  log(message: string, players?: Player[]) {
    this.info(message, players);
  }

  /**
   * Log with {@link LogLevel.DEBUG}
   * @param message
   * @param players
   */
  debug(message: string, players?: Player[]) {
    const content = `§b§l[${this.id}]§r§p§o[DEBUG]§r ${message}`;
    addToLogHistory(content);
    if (players !== undefined) {
      players.forEach((player: Player) => {
        player.sendMessage(content);
      });
    } else {
      sendMessage(content, LogLevel.DEBUG);
    }
  }

  /**
   * Log with {@link LogLevel.INFO}
   * The message will be sent to world if no players are given.
   * @param message
   * @param players
   */
  info(message: string, players?: Player[]) {
    const content = `§b§l[${this.id}]§r§9§o[INFO]§r ${message}`;
    addToLogHistory(content);
    if (players !== undefined) {
      players.forEach((player: Player) => {
        player.sendMessage(content);
      });
    } else {
      sendMessage(content, LogLevel.DEBUG);
    }
  }

  /**
   * Same as console.warn.
   * @param message
   * @param players the players that would receive stack trace.
   */
  warn(message: string, players?: Player[]) {
    const content = `§b§l[${this.id}]§r§e§o[WARN]§r ${message}`;
    const stacktrace = `§oStacktrace: §r\n${getStackTrace()}`;
    addToLogHistory(content);
    addToLogHistory(stacktrace);
    console.warn(content);
    if (players !== undefined) {
      players.forEach((player: Player) => {
        player.sendMessage(stacktrace);
      });
    }
  }

  /**
   * Same as console.error.
   * @param message
   * @param players the players that would receive stack trace.
   */
  error(message: string, players?: Player[]) {
    const content = `§b§l[${this.id}]§r§c§o[ERROR]§r ${message}`;
    const stacktrace = `§oStacktrace: §r\n${getStackTrace()}`;
    addToLogHistory(content);
    addToLogHistory(stacktrace);
    console.error(content);
    if (players !== undefined) {
      players.forEach((player: Player) => {
        player.sendMessage(stacktrace);
      });
    }
  }

  /**
   * Same as `error()`, but the stack trace will be sent to all players
   */
  fatal(message: string) {
    const content = `§b§l[${this.id}]§r§c§o[ERROR]§r ${message}`;
    const stacktrace = `§oStacktrace: §r\n${getStackTrace()}`;
    addToLogHistory(content);
    addToLogHistory(stacktrace);
    console.error(content);
    console.error(stacktrace);
  }
}
