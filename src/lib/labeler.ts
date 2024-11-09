import {ComAtprotoLabelDefs} from '@atproto/api';
import {LabelerServer} from '@skyware/labeler';

import {DID, PORT, SIGNING_KEY} from '../config';
import logger from './logger';

const labelerServer = new LabelerServer({did: DID, signingKey: SIGNING_KEY});

export const startLabeler = () => {
  labelerServer.start(PORT, (error, address) => {
    if (error) {
      logger.error('Error starting server: %s', error);
    } else {
      logger.info(`Labeler server listening on ${address}`);
    }
  });
}

export const stopLabeler = () => {
  labelerServer.stop();
}

export const fetchCurrentLabels = (did: string): Set<string> => {
  const query = labelerServer.db
    .prepare<unknown[], ComAtprotoLabelDefs.Label>(`SELECT * FROM labels WHERE uri = ?`)
    .all(did);

  const labels = query.reduce((set, label) => {
    if (!label.neg) set.add(label.val);
    else set.delete(label.val);
    return set;
  }, new Set<string>());

  if (labels.size > 0) {
    logger.info(`Current labels: ${Array.from(labels).join(', ')}`);
  }

  return labels;
}

export const deleteAllLabels = async (did: string, labels: Set<string>) => {
  const labelsToDelete: string[] = Array.from(labels);

  if (labelsToDelete.length === 0) {
    logger.info(`No labels to delete`);
  } else {
    logger.info(`Labels to delete: ${labelsToDelete.join(', ')}`);
    try {
      await labelerServer.createLabels({uri: did}, {negate: labelsToDelete});
      logger.info('Successfully deleted all labels');
    } catch (error) {
      logger.error(`Error deleting all labels: ${error}`);
    }
  }
}

export const addOrUpdateLabel = async (did: string, currentLabels: Set<string>, newLabels: Array<string>) => {
  if (currentLabels.size >= 1) {
    try {
      await labelerServer.createLabels({uri: did}, {negate: Array.from(currentLabels)});
      logger.info(`Successfully negated existing labels: ${Array.from(currentLabels).join(', ')}`);
    } catch (error) {
      logger.error(`Error negating existing labels: ${error}`);
    }
  }

  try {
    await labelerServer.createLabels({uri: did}, {create: newLabels});
    logger.info(`Successfully labeled ${did} with ${newLabels.length} labels`);
  } catch (error) {
    logger.error(`Error adding new label: ${error}`);
  }
}
