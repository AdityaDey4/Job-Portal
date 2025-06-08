import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, changeExpiry } from "../controllers/jobController.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get( getJobById);
router.route("/edit/:id").put( isAuthenticated, updateJob);
router.route("/expiry/:id").post(isAuthenticated, changeExpiry);

export default router;
