import {LabelerServer} from '@skyware/labeler';

import {DID, HOST, PORT, SIGNING_KEY, TURSO_AUTH_TOKEN, TURSO_DATABASE_URL} from '../config';
import logger from './logger';
import {Label} from "../types";
import {LABELS} from "../labels.js";

const labelerServer = new LabelerServer({
  did: DID,
  signingKey: SIGNING_KEY,
  dbUrl: TURSO_DATABASE_URL,
  dbToken: TURSO_AUTH_TOKEN,
});

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

export const fetchCurrentLabels = async (did: string): Promise<Set<Label>> => {
  const result = await labelerServer.db.execute({
    sql: "SELECT * FROM labels WHERE uri = ?",
    args: [did]
  });

  const labels = result.rows.reduce((set, label) => {
    if (!label.neg) set.add(label.val);
    else set.delete(label.val);
    return set;
  }, new Set<string>());

  if (labels.size > 0) {
    logger.info(`Current labels: ${Array.from(labels).join(', ')}`);
  }
  
  const currentLabels = new Set<Label>();
  LABELS.forEach(label => {
    if (labels.has(label)) {
      currentLabels.add(label);
    }
  });

  return currentLabels;
}

export const deleteAllLabels = async (did: string, currentLabels: Set<Label>) => {
  const labelsToDelete: string[] = Array.from(currentLabels).map(label => label.identifier);

  if (labelsToDelete.length === 0) {
    logger.info(`No labels to delete`);
  } else {
    logger.info(`Labels to delete: ${labelsToDelete.join(', ')}`);
    try {
      await labelerServer.createLabels({ uri: did }, { negate: labelsToDelete });
      logger.info('Successfully deleted all labels');
    } catch (error) {
      logger.error(`Error deleting all labels: ${error}`);
    }
  }
}

export const addOrUpdateLabel = async (did: string, label: Label, currentLabels: Set<Label>) => {
  const currentLabelsArray = Array.from(currentLabels);
  if(currentLabelsArray.some(currentLabel => currentLabel.identifier === label.identifier)) {
    logger.info(`Label ${label.identifier} already exists`);
    return;
  }
  
  const labelsToDelete: string[] = currentLabelsArray
    .filter(currentLabel => currentLabel.type === label.type && currentLabel.identifier !== label.identifier)
    .map(currentLabel => currentLabel.identifier);
  
  if (labelsToDelete.length > 0) {
    try {
      await labelerServer.createLabels({ uri: did }, { negate: labelsToDelete });
      logger.info(`Successfully negated existing labels: ${Array.from(currentLabels).join(', ')}`);
    } catch (error) {
      logger.error(`Error negating existing labels: ${error}`);
    }
  }

  try {
    await labelerServer.createLabel({ uri: did, val: label.identifier });
    logger.info(`Successfully labeled ${did} with ${label.identifier}`);
  } catch (error) {
    logger.error(`Error adding new label: ${error}`);
  }
}
