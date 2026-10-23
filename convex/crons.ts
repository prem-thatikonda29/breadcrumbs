import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("clean up orphaned uploads", { hours: 24 }, internal.storage.cleanupOrphanedFiles, {});

export default crons;
