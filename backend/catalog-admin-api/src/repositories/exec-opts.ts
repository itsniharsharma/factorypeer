import type { ClientSession, Types } from "mongoose";

/** Passed to repositories for Mongo transactions and audit fields. */
export type ExecOpts = {
  session?: ClientSession;
  actorId?: Types.ObjectId | null;
};
