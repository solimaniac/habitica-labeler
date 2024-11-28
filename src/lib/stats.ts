import fetch from 'node-fetch';
import {
  createStats,
  deleteStatsById,
  getStatsByLocalId,
  getStatsOlderThan,
  updateStats,
  updateStatsTimestamp
} from './db-client';
import {addOrUpdateLabel, fetchCurrentLabels} from "./labeler";
import {getAllLabels} from "../labels";
import {BATCH_LIMIT, DELAY_BETWEEN_SYNCS_MS, HABITICA_AUTHOR_USER_ID, STALE_THRESHOLD_MINUTES} from "../config";
import logger from "./logger";

export async function syncStaleStats(): Promise<void> {
  try {
    const staleDate = new Date(Date.now() - (STALE_THRESHOLD_MINUTES * 60 * 1000));
    const staleStats = await getStatsOlderThan(staleDate, BATCH_LIMIT);

    logger.info(`Found ${staleStats.length} stale stats to sync`);

    for (const stats of staleStats) {
      try {
        await syncMemberStats(stats.remoteId, stats.localId);
        logger.info(`Successfully synced stats for user ${stats.localId}`);
      } catch (error) {
        logger.error(`Error syncing stats for user ${stats.localId}:`, error);
      }

      // Wait 2 seconds before processing the next user
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_SYNCS_MS));
    }
  } catch (error) {
    logger.error('Error in periodic stats sync:', error.message, error.stack);
  }
}

interface HabiticaMemberResponse {
  success: boolean;
  data: {
    _id: string;
    stats: {
      class: string;
      lvl: number;
      hp: number;
      mp: number;
      maxHealth: number,
      maxMP: number
    };
  };
}

export async function syncMemberStats(remoteId: string, localId: string): Promise<void> {
  const response = await fetch(`https://habitica.com/api/v3/members/${remoteId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-client': HABITICA_AUTHOR_USER_ID + '-habitica-bluesky-labeler',
    },
  })

  if (!response.ok) {
    throw new Error(`Error fetching user ${localId} info, status: ${response.status}`);
  }

  const data = await response.json() as HabiticaMemberResponse;

  if (!data.success) {
    throw new Error(`Error fetching user ${localId} info, status: ${data.success}`);
  }

  const {stats} = data.data;
  const existingStats = await getStatsByLocalId(localId);
  const currentLabels = await fetchCurrentLabels(localId);

  if (existingStats) {
    const hasChanged =
      existingStats.class !== stats.class ||
      existingStats.level !== stats.lvl.toString() ||
      existingStats.health !== stats.hp.toString() ||
      existingStats.mana !== stats.mp.toString() ||
      existingStats.maxMana !== stats.maxMP.toString() ||
      existingStats.maxHealth !== stats.maxHealth.toString();

    if (!hasChanged) {
      await updateStatsTimestamp(existingStats.id);
      return;
    }

    await updateStats(
      existingStats.id,
      remoteId,
      stats.class,
      stats.lvl.toString(),
      stats.hp.toString(),
      stats.maxHealth.toString(),
      stats.mp.toString(),
      stats.maxMP.toString()
    );
  } else {
    await createStats(
      localId,
      remoteId,
      stats.class,
      stats.lvl.toString(),
      stats.hp.toString(),
      stats.maxHealth.toString(),
      stats.mp.toString(),
      stats.maxMP.toString()
    );
  }
  const newLabels = getAllLabels(
    stats.class,
    stats.lvl,
    stats.hp,
    stats.maxHealth,
    stats.mp,
    stats.maxMP
  );

  for (const newLabel of newLabels) {
    await addOrUpdateLabel(
      localId,
      newLabel,
      currentLabels,
    );
  }
}

export async function clearMemberStats(
  localId: string
) {
  const existingStats = await getStatsByLocalId(localId);

  if (!existingStats) {
    return;
  }

  await deleteStatsById(existingStats.id);
}
