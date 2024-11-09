import fetch from 'node-fetch';
import {createStats, deleteStatsById, getStatsByLocalId, updateStats, updateStatsTimestamp} from './db-client';
import {addOrUpdateLabel, fetchCurrentLabels} from "./labeler";
import {getAllLabels} from "../labels";
import {HABITICA_AUTHOR_USER_ID} from "../config";

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

    const labels = fetchCurrentLabels(localId);
    await addOrUpdateLabel(
      localId,
      labels,
      getAllLabels(
        stats.class,
        stats.lvl,
        stats.hp,
        stats.maxHealth,
        stats.mp,
        stats.maxMP
      )
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

    const labels = fetchCurrentLabels(localId);
    await addOrUpdateLabel(
      localId,
      labels,
      getAllLabels(
        stats.class,
        stats.lvl,
        stats.hp,
        stats.maxHealth,
        stats.mp,
        stats.maxMP
      )
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
