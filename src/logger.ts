import { Player, world } from "@minecraft/server";
import { requireNonNull } from "./misc";
import { getModName } from "./index";

export function getStackTrace(): string {
  return requireNonNull(Error().stack);
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
    if (players !== undefined) {
      players.forEach((player: Player) => {
        player.sendMessage(`§b§l[${this.id}]§r§p§o[DEBUG]§r ${message}`);
      });
    } else {
      sendMessage(`§b§l[${this.id}]§r§p§o[DEBUG]§r ${message}`, LogLevel.DEBUG);
    }
  }

  /**
   * Log with {@link LogLevel.INFO}
   * The message will be sent to world if no players are given.
   * @param message
   * @param players
   */
  info(message: string, players?: Player[]) {
    if (players !== undefined) {
      players.forEach((player: Player) => {
        player.sendMessage(`§b§l[${this.id}]§r§9§o[INFO]§r ${message}`);
      });
    } else {
      sendMessage(`§b§l[${this.id}]§r§9§o[INFO]§r ${message}`, LogLevel.DEBUG);
    }
  }

  /**
   * Same as console.warn.
   * @param message
   * @param players the players that would receive stack trace.
   */
  warn(message: string, players?: Player[]) {
    console.warn(`§b§l[${this.id}]§r§e§o[WARN]§r ${message}`);
    if (players !== undefined) {
      players.forEach((player: Player) => {
        player.sendMessage(`§oStacktrace: §r\n${getStackTrace()}`);
      });
    }
  }

  /**
   * Same as console.error.
   * @param message
   * @param players the players that would receive stack trace.
   */
  error(message: string, players?: Player[]) {
    console.error(`§b§l[${this.id}]§r§c§o[ERROR]§r ${message}`);
    if (players !== undefined) {
      players.forEach((player: Player) => {
        player.sendMessage(`§oStacktrace: §r\n${getStackTrace()}`);
      });
    }
  }

  /**
   * Same as `error()`, but the stack trace will be sent to all players
   */
  fatal(message: string) {
    console.error(`§b§l[${this.id}]§r§c§o[ERROR]§r ${message}`);
    console.error(`§oStacktrace: §r\n${getStackTrace()}`);
  }
}
