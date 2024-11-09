import {Bot, ChatMessage} from "@skyware/bot";
import {getStatsByLocalId} from "./db-client";
import {syncMemberStats} from "./stats";
import {BSKY_BOT_IDENTIFIER, BSKY_BOT_PASSWORD} from "../config";
import logger from "./logger";

const bot = new Bot({
  emitChatEvents: true 
});

export const startBot = async () => {
  await bot.login({
    identifier: BSKY_BOT_IDENTIFIER,
    password: BSKY_BOT_PASSWORD,
  });
  

  bot.on("message", async (message: ChatMessage) => {
    const sender = await message.getSender();
    logger.info(`Received message from @${sender.handle}: ${message.text}`);
    
    const response = await validateAndSyncStats(sender.did.toString(), message.text);

    const conversation = await message.getConversation();
    if (conversation) {
      await conversation.sendMessage({text: response});
    }
  });
}

const isValidUUID = (str: string): boolean => {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}

export const validateAndSyncStats = async (
  localId: string,
  potentialUUID: string
): Promise<string> => {
  try {
    if (!isValidUUID(potentialUUID)) {
      return'Not a valid account user ID. Please double-check and try again.'
    }

    const existingStats = await getStatsByLocalId(localId);

    if (existingStats) {
      return 'Your account is already linked!'
    }

    await syncMemberStats(potentialUUID, localId);

    return 'Successfully linked your account!';

  } catch (error) {
    logger.error(`Error syncing stats for user ${localId}: ${error}`);
    return 'Sorry, something went wrong. Please try again later.';
  }
}
