import { ItemStack, Player, RawMessage, world } from "@minecraft/server";
// noinspection ES6UnusedImports
import {
  MessageFormData,
  ActionFormData,
  ModalFormData,
  ActionFormResponse,
  MessageFormResponse,
} from "@minecraft/server-ui";
import * as itemApi from "../server/item.js";
import * as miscApi from "../misc.js";

/**
 * Create a QuestBook.
 */
export class QuestBook {
  /**
   * The unique id of the QuestBook.
   */
  readonly id: string;
  /**
   * The title the QuestBook.
   */
  title: string | RawMessage;
  body: string | RawMessage;
  private readonly quests: Quest[];
  constructor(
    id: string,
    title: string,
    body: string | RawMessage,
    quests: Quest[],
  ) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.quests = quests;
  }
  display(player: Player): void {
    const mainForm: ActionFormData = new ActionFormData();
    mainForm.title(this.title);
    mainForm.body(this.body);
    this.quests.forEach((quest: Quest) => {
      mainForm.button(
        quest.title + (quest.isCompleted(player) ? " §2✔" : ""),
        quest.icon,
      );
    });
    mainForm.show(player).then((response: ActionFormResponse) => {
      if (response.canceled || response.selection === undefined) {
        return;
      }
      const quest: Quest = this.quests[response.selection];
      quest.display(player, this);
    });
  }

  /**
   * Add a quest.
   * @param quest
   * @param message optional information will be sent to world.
   */
  addQuest(quest: Quest, message?: string | RawMessage): void {
    this.quests.push(quest);
    if (typeof message === "string") {
      world.sendMessage({ text: message });
      return;
    }
    if (message) {
      world.sendMessage(message);
      return;
    }
  }
  /**
   * Get the quest by id.
   * @param id
   */
  getQuest(id: string): Quest | undefined {
    return this.quests.find((quest: Quest) => quest.id === id);
  }
  /**
   * get all quests.
   */
  getQuests(): Quest[] {
    return this.quests;
  }
}

/**
 * Create a Quest (or Message).
 */
export class Quest {
  /**
   * The unique id of the Quest.
   */
  readonly id: string;
  /**
   * The title the Quest.
   */
  protected _title: string | RawMessage;
  /**
   * The content the Quest.
   */
  protected _body: string | RawMessage;
  /**
   * The type the Quest.
   */
  type: QuestTypes;
  /**
   * The condition to complete the quest / unlock the message.
   */
  condition: QuestCondition;
  /**
   * It will be called when the quest is completed by the player.
   */
  award?: QuestAward;
  /**
   * The icon of the Quest.
   * It should be the path from the root of the resource pack.
   * @example texture/gui/example_pic
   */
  icon?: string;
  private readonly form: MessageFormData;
  constructor(
    id: string,
    title: string | RawMessage,
    body: string | RawMessage,
    type: QuestTypes,
    condition: QuestCondition,
    award?: QuestAward,
    icon?: string,
  ) {
    this.id = id;
    this._title = title;
    this._body = body;
    this.type = type;
    this.icon = icon;
    this.condition = condition;
    this.award = award;
    this.form = new MessageFormData()
      .title(this._title)
      .body(this._body)
      .button1({ translate: "gui.done" })
      .button2({ translate: "gui.back" });
  }
  set body(content: string | RawMessage) {
    this._body = content;
    this.form.body(content);
  }
  get body() {
    return this._body;
  }
  set title(content: string | RawMessage) {
    this._title = content;
    this.form.title(content);
  }
  get title() {
    return this._title;
  }
  /**
   * Return if this quest can be completed.
   * @param player
   */
  canComplete(player: Player): true | RawMessage {
    let message: RawMessage = { rawtext: [] };
    for (const itemData of this.condition.item ?? []) {
      const container = player.getComponent("minecraft:inventory")?.container;
      if (!container) return { translate: "sapi-utils.unexpected_error" };
      if (
        itemApi.getItemAmountInContainer(container, itemData.item.typeId) <
        itemData.item.amount
      ) {
        if (
          !message.rawtext?.some(
            (item) => item.translate === "sapi-utils.condition.item_not_enough",
          )
        ) {
          message.rawtext?.push({
            translate: "sapi-utils.condition.item_not_enough",
          });
        }
        message.rawtext?.push({
          rawtext: [
            {
              text: "\n",
            },
            {
              translate: itemData.translateString,
            },
            {
              text: "*",
            },
            {
              text: (
                itemData.item.amount -
                itemApi.getItemAmountInContainer(
                  container,
                  itemData.item.typeId,
                )
              ).toString(),
            },
          ],
        });
      }
    }
    return true;
  }
  complete(player: Player): void {
    player.addTag(`sapi-u:${this.id}`);
  }
  /**
   * Display the form to a player.
   * @param player
   * @param book if specific, the book will be opened after canceled.
   */
  display(player: Player, book?: QuestBook): void {
    this.form.show(player).then((response: MessageFormResponse) => {
      if (
        response.canceled ||
        response.selection === undefined ||
        response.selection === 1
      ) {
        book?.display(player);
        return;
      }
      if (this.canComplete(player) === true) {
        this.complete(player);
        return;
      }
    });
  }
  /**
   * Check if a player has completed this quest.
   * @param player
   */
  isCompleted(player: Player): boolean {
    return player.hasTag(`sapi-u:${this.id}`);
  }
  /**
   * Check if the type is INFO
   */
  isMessage(): boolean {
    return this.type === QuestTypes.INFO;
  }
}

/**
 * The type of the quest.
 */
export enum QuestTypes {
  INFO,
  QUEST,
}

export interface QuestCondition {
  /**
   * Match only typeId and min amount.
   */
  item?: ItemData[];
  /**
   * The specific level will be required to unlock the quest.
   */
  playerXpLevel?: number;
  /**
   * The specific point will be required to unlock the quest.
   */
  playerXpPoint?: number;
  /**
   * Your custom function to check condition.
   * the string (or RawMessage) will be displayed to the player as the quest can not be completed.
   * Return undefined if the quest can be completed.
   */
  custom: (player: Player) => string | RawMessage | undefined;
}

export interface QuestAward {
  /**
   * Player will get these items when the quest is finished.
   */
  item?: ItemData[];
  /**
   * The specific level will be given to the player.
   */
  playerXpLevel?: number;
  /**
   * The specific point will be given to the player.
   */
  playerXpPoint?: number;
  /**
   * Your custom function give award.
   */
  custom: (player: Player) => void;
}

export interface ItemData {
  translateString: string;
  item: ItemStack;
}
