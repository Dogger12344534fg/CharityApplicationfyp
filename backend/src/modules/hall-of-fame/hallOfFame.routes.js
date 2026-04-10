import express from "express";
import {
  getTopDonors,
  getTopTeams,
  getLeaderboard,
} from "./hallOfFame.controller.js";

const router = express.Router();

router.get("/donors", getTopDonors);

router.get("/teams", getTopTeams);

router.get("/", getLeaderboard);

export default router;
