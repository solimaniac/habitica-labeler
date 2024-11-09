import {CommitCreateEvent, Jetstream} from '@skyware/jetstream';

import {
  BSKY_BOT_IDENTIFIER,
  BSKY_BOT_PASSWORD,
  CURSOR_UPDATE_INTERVAL,
  DID,
  FIREHOSE_URL,
  PORT,
  WANTED_COLLECTION
} from './config.js';
import {label, labelerServer} from './label.js';
import logger from './logger.js';
import {ChatMessage} from "@skyware/bot";
import {bot} from "./bot.js";
import {initCursor, setCursor} from "./lib/cursor.js";

let cursor = 0;
let cursorUpdateInterval;

function epochUsToDateTime(cursor: number): string {
  return new Date(cursor / 1000).toISOString();
}

await initCursor()

await bot.login({
  identifier: BSKY_BOT_IDENTIFIER,
  password: BSKY_BOT_PASSWORD,
});

bot.on("message", async (message: ChatMessage) => {
  const sender = await message.getSender();
  console.log(`Received message from @${sender.handle}: ${message.text}`);

  const conversation = await message.getConversation();
  if (conversation) {
    await conversation.sendMessage({text: "Hey there, " + sender.displayName + "!"});
  }
});

const jetstream = new Jetstream({
  wantedCollections: [WANTED_COLLECTION],
  endpoint: FIREHOSE_URL,
  cursor: cursor,
});

jetstream.on('open', () => {
  logger.info(
    `Connected to Jetstream at ${FIREHOSE_URL} with cursor ${jetstream.cursor} (${epochUsToDateTime(jetstream.cursor!)})`,
  );
  cursorUpdateInterval = setInterval(async () => {
    if (jetstream.cursor) {
      await setCursor(jetstream.cursor);
    }
  }, CURSOR_UPDATE_INTERVAL);
});

jetstream.on('close', () => {
  clearInterval(cursorUpdateInterval);
  logger.info('Jetstream connection closed.');
});

jetstream.on('error', (error) => {
  logger.error(`Jetstream error: ${error.message}`);
});

jetstream.onCreate(WANTED_COLLECTION, (event: CommitCreateEvent<typeof WANTED_COLLECTION>) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (event.commit?.record?.subject?.uri?.includes(DID)) {
    label(event.did, event.commit.record.subject.uri.split('/').pop()!).catch((error: unknown) => {
      logger.error(`Unexpected error labeling ${event.did}: ${error}`);
    });
  }
});

labelerServer.start(PORT, (error, address) => {
  if (error) {
    logger.error('Error starting server: %s', error);
  } else {
    logger.info(`Labeler server listening on ${address}`);
  }
});

jetstream.start();

async function shutdown() {
  try {
    logger.info('Shutting down gracefully...');
    await setCursor(jetstream.cursor!);
    jetstream.close();
    labelerServer.stop();
  } catch (error) {
    logger.error(`Error shutting down gracefully: ${error}`);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
