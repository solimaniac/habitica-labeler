import {Cursor} from '@prisma/client'
import {getCursor, upsertCursor} from "./db-client.js";
import logger from "../logger.js";

const epochUsToDateTime = (cursor: number): string => {
  logger.info(`Converting cursor: ${cursor}`);
  return new Date(cursor / 1000).toISOString();
}

export const initCursor = async (): Promise<number> => {
  const cursor: Cursor | null = await getCursor();

  if (!cursor) {
    const newCursor = Math.floor(Date.now() * 1000);
    logger.info(`Cursor not found, setting cursor to: ${newCursor} (${epochUsToDateTime(newCursor)})`);
    await upsertCursor(newCursor.toString());
    return newCursor;
  }
  logger.info(`Cursor found: ${cursor.content} (${epochUsToDateTime(cursor.content)})`);
  return cursor.content;
}

export const setCursor = async (cursor: number) => {
  try {
    await upsertCursor(cursor.toString());
    logger.info(`Cursor updated to: ${cursor} (${epochUsToDateTime(cursor)})`);
  } catch (error) {
    logger.error(`Error updating cursor: ${error}`);
  }
}


