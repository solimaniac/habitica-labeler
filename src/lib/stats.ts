import fetch from 'node-fetch';
import {deleteStatsById, getStatsByLocalId, upsertStats} from './db-client';
import {addOrUpdateLabel, fetchCurrentLabels} from "./labeler.js";
import {getAllLabels} from "../constants.js";

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
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching user ${localId} info, status: ${response.status}`);
  }

  const data = await response.json() as HabiticaMemberResponse;

  if (!data.success) {
    throw new Error(`Error fetching user ${localId} info, status: ${data.success}`);
  }

  const {stats} = data.data;
  
  await upsertStats(
    `${localId}-${remoteId}`, // Composite ID
    localId,
    remoteId,
    stats.class,
    stats.lvl.toString(),
    stats.hp.toString(),
    stats.mp.toString()
  );

  const labels = fetchCurrentLabels(localId);
  await addOrUpdateLabel(localId, labels, getAllLabels(stats.class, stats.lvl, stats.hp, stats.maxHealth, stats.mp, stats.maxMP));
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
