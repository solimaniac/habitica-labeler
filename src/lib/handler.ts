import {AppBskyActorDefs} from "@atproto/api";
import logger from "./logger";
import {DELETE_POST_REF} from "../config";
import {clearMemberStats} from "./stats";
import {deleteAllLabels} from "./labeler";

export const handleLike = async (subject: string | AppBskyActorDefs.ProfileView, rkey: string) => {
  const did = AppBskyActorDefs.isProfileView(subject) ? subject.did : subject;
  logger.info(`Received rkey: ${rkey} for ${did}`);

  if (rkey === 'self') {
    logger.info(`${did} liked the labeler. Returning.`);
    return;
  }

  if (rkey.includes(DELETE_POST_REF)) {
    await deleteAllLabels(did);
    await clearMemberStats(did);
  }
};
