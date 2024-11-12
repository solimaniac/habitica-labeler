import {LabelerServer, signLabel} from '@skyware/labeler';

import {DID, HOST, PORT, SIGNING_KEY} from '../config';
import logger from './logger';
import {LABELS} from "../labels";

const labelerServer = new LabelerServer({did: DID, signingKey: SIGNING_KEY});

export const startLabeler = () => {
  labelerServer.app.listen({port: PORT, host: HOST}, (error, address) => {
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

export const deleteAllLabels = async (did: string) => {
  const labelsToDelete: string[] = Array.from(LABELS.map(label => label.identifier));

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

export const addOrUpdateLabel = async (did: string, currentLabels: Array<string>, newLabels: Array<string>) => {
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
