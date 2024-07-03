const TAB = "   ";
const COLORS = {
  _prototype: "§p",
  bigint: "§1",
  boolean: "§c",
  function: "§5",
  number: "§b",
  string: "§a",
  symbol: "§h",
  undefined: "§j",
  null: "§d",
  NaN: "§8",
  end: "§r§f",
};

/**
 * Like `JSON.stringify`, but it can be used to log to the world prettily.
 *
 * It may cause Stack Overflow so make sure the user's computer is strong enough or the object is not too large.
 * @param obj
 * @param pretty if it's set to true, colors and white spaces will be added.
 */
export function stringify(obj: any, pretty: boolean = false) {
  if (typeof obj !== "object") return simpleStringify(obj, pretty);
  return objectStringify(obj, pretty);
}

function objectStringify(
  obj: any,
  pretty: boolean,
  isProperty: boolean = false,
  isInArray: boolean = false,
  tabCount: number = 0,
) {
  if (Array.isArray(obj))
    return arrayStringify(obj, pretty, isProperty, tabCount);
  if (isNull(obj)) return nullStringify(obj, pretty);
  const nextTabCount: number = tabCount + 1;
  let head: string = `${pretty ? COLORS._prototype : ""}${Object.getPrototypeOf(obj).constructor.name}${pretty ? COLORS.end : ""} {`;
  if (!(isProperty || isInArray))
    head = (pretty ? TAB.repeat(tabCount) : "") + head;
  const keys: string[] = getKeys(obj);
  const end: string = (pretty ? TAB.repeat(tabCount) : "") + "}";
  let body: string = "";
  for (let i = 0; i < keys.length; i++) {
    const key: string = keys[i];
    body +=
      (pretty ? TAB.repeat(nextTabCount) : "") +
      key +
      ": " +
      objectStringify(obj[key], pretty, true, false, nextTabCount);
    if (i != keys.length - 1) body += "," + (pretty ? "\n" : "");
  }
  return `${head}${pretty ? "\n" : ""}${body}${pretty ? "\n" : ""}${end}`;
}

function arrayStringify(
  obj: Array<any>,
  pretty: boolean,
  isProperty: boolean = false,
  tabCount: number,
): string {
  const nextTabCount: number = tabCount + 1;
  let head: string = "[";
  if (!isProperty) head = (pretty ? TAB.repeat(tabCount) : "") + head;
  const end: string = (pretty ? TAB.repeat(tabCount) : "") + "]";
  let body: string = "";
  for (let i = 0; i < obj.length; i++) {
    const e = obj[i];
    if (i != obj.length - 1)
      body +=
        (pretty ? TAB.repeat(nextTabCount) : "") +
        objectStringify(e, pretty, false, true, nextTabCount) +
        "," +
        (pretty ? "\n" : "");
    else
      body +=
        (pretty ? TAB.repeat(nextTabCount) : "") +
        objectStringify(e, pretty, false, true, nextTabCount);
  }
  return `${head}${pretty ? "\n" : ""}${body}${pretty ? "\n" : ""}${end}`;
}

function simpleStringify(obj: any, pretty: boolean): string {
  switch (typeof obj) {
    case "bigint":
      return bigintStringify(obj, pretty);
    case "boolean":
      return booleanStringify(obj, pretty);
    case "function":
      return functionStringify(obj, pretty);
    case "number":
      return numberStringify(obj, pretty);
    case "string":
      return stringStringify(obj, pretty);
    case "symbol":
      return symbolStringify(obj, pretty);
    case "undefined":
      return undefinedStringify(obj, pretty);
    default:
      return "";
  }
}

function isNull(obj: any): boolean {
  return typeof obj == "object" && obj == undefined;
}

function bigintStringify(obj: bigint, pretty: boolean) {
  return (
    (pretty ? COLORS.bigint : "") +
    obj.toString() +
    "n" +
    (pretty ? COLORS.end : "")
  );
}

function booleanStringify(obj: boolean, pretty: boolean) {
  return (
    (pretty ? COLORS.boolean : "") + obj.toString() + (pretty ? COLORS.end : "")
  );
}

function functionStringify(obj: Function, pretty: boolean) {
  return (pretty ? COLORS.function : "") + "f" + (pretty ? COLORS.end : "");
}

function numberStringify(obj: number, pretty: boolean) {
  if (Number.isNaN(obj))
    return (pretty ? COLORS.NaN : "") + "NaN" + (pretty ? COLORS.end : "");
  return (pretty ? COLORS.number : "") + obj + (pretty ? COLORS.end : "");
}

function stringStringify(obj: string, pretty: boolean) {
  return (
    (pretty ? COLORS.string : "") + `"` + obj + `"` + (pretty ? COLORS.end : "")
  );
}

function symbolStringify(obj: symbol, pretty: boolean) {
  return (
    (pretty ? COLORS.symbol : "") + obj.toString() + (pretty ? COLORS.end : "")
  );
}

function undefinedStringify(obj: undefined, pretty: boolean) {
  return (
    (pretty ? COLORS.undefined : "") + "undefined" + (pretty ? COLORS.end : "")
  );
}

function nullStringify(obj: null, pretty: boolean) {
  return (pretty ? COLORS.null : "") + "null" + (pretty ? COLORS.end : "");
}

function getKeys(value: Object): string[] {
  let keys: string[] = Object.keys(value);
  if (Object.getPrototypeOf(value) != Object.prototype)
    for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(value)))
      key in ["constructor"] || keys.push(key);
  return keys;
}
