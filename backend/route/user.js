import express from "express";
import { login, logout, register, updateProfile, saveJob, getSavedJobs, changePassword, forgetPassword } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
 
const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/changePassword").put(isAuthenticated, changePassword);
router.route("/forgetPassword").put(forgetPassword);
router.route("/saveJob/get").get(isAuthenticated, getSavedJobs);
router.route("/saveJob/add").put(isAuthenticated, saveJob);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;