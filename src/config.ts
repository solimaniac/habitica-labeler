import 'dotenv/config';

export const DID = process.env.DID ?? '';
export const SIGNING_KEY = process.env.SIGNING_KEY ?? '';
export const HOST = process.env.HOST ?? '0.0.0.0';
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4002;
export const FIREHOSE_URL = process.env.FIREHOSE_URL ?? 'wss://jetstream.atproto.tools/subscribe';
export const WANTED_COLLECTION = 'app.bsky.feed.like';
export const BSKY_IDENTIFIER = process.env.BSKY_IDENTIFIER ?? '';
export const BSKY_PASSWORD = process.env.BSKY_PASSWORD ?? '';
export const BSKY_BOT_IDENTIFIER = process.env.BSKY_BOT_IDENTIFIER ?? '';
export const BSKY_BOT_PASSWORD = process.env.BSKY_BOT_PASSWORD ?? '';
export const HABITICA_AUTHOR_USER_ID = process.env.HABITICA_AUTHOR_USER_ID ?? '';
export const CURSOR_UPDATE_INTERVAL =
  process.env.CURSOR_UPDATE_INTERVAL ? Number(process.env.CURSOR_UPDATE_INTERVAL) : 10000;
export const DELETE_POST_REF = process.env.DELETE_POST_REF ?? '';

export const SYNC_INTERVAL_MINUTES = process.env.SYNC_INTERVAL_MINUTES ?? 5;
export const STALE_THRESHOLD_MINUTES = process.env.STALE_THRESHOLD_MINUTES ?? 24 * 60;
export const BATCH_LIMIT = process.env.BATCH_LIMIT ?? 50;
export const DELAY_BETWEEN_SYNCS_MS = process.env.DELAY_BETWEEN_SYNCS_MS ?? 2000;
