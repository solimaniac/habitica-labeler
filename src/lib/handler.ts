import {AppBskyActorDefs} from "@atproto/api";
import logger from "./logger";
import {DELETE_POST_REF} from "../config";
import {clearMemberStats} from "./stats";
import {deleteAllLabels, fetchCurrentLabels} from "./labeler";

export const handleLike = async (subject: string | AppBskyActorDefs.ProfileView, rkey: string) => {
  const did = AppBskyActorDefs.isProfileView(subject) ? subject.did : subject;
  logger.info(`Received rkey: ${rkey} for ${did}`);

  if (rkey === 'self') {
    logger.info(`${did} liked the labeler. Returning.`);
    return;
  }
  const labels = fetchCurrentLabels(did);

  if (rkey.includes(DELETE_POST_REF)) {
    await deleteAllLabels(did, labels);
    await clearMemberStats(did);
  }
};
