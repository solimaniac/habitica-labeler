import {CommitCreateEvent, Jetstream} from '@skyware/jetstream';

import {
  CURSOR_UPDATE_INTERVAL,
  DID,
  FIREHOSE_URL,
  WANTED_COLLECTION
} from './config';
import {startLabeler, stopLabeler} from './lib/labeler';
import logger from './lib/logger';
import {startBot} from "./lib/bot";
import {initCursor, setCursor} from "./lib/cursor";
import {handleLike} from "./lib/handler";
import {syncStaleStats} from "./lib/stats";
import cron from 'node-cron'

let cursorUpdateInterval: NodeJS.Timeout;

const initialCursor = await initCursor()

const jetstream = new Jetstream({
  wantedCollections: [WANTED_COLLECTION],
  endpoint: FIREHOSE_URL,
  cursor: initialCursor,
});

jetstream.on('open', () => {
  logger.info(
    `Connected to Jetstream at ${FIREHOSE_URL} with cursor ${jetstream.cursor}`,
  );
  cursorUpdateInterval = setInterval(async () => {
    if (jetstream.cursor) {
      await setCursor(jetstream.cursor);
    }
  }, CURSOR_UPDATE_INTERVAL) as NodeJS.Timeout;
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
    handleLike(event.did, event.commit.record.subject.uri.split('/').pop()!).catch((error: unknown) => {
      logger.error(`Unexpected error handling liked post ${event.did}: ${error}`);
    });
  }
});

await startBot()
startLabeler();
jetstream.start();
cron.schedule('*/5 * * * *', async () => {
  try {
    await syncStaleStats();
  } catch (error) {
    console.error('Failed to sync stale stats:', error)
  }
})

async function shutdown() {
  try {
    logger.info('Shutting down gracefully...');
    await setCursor(jetstream.cursor!);
    jetstream.close();
    stopLabeler();
  } catch (error) {
    logger.error(`Error shutting down gracefully: ${error}`);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
