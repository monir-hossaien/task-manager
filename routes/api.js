
import * as TaskController from "../app/controllers/taskController.js";
import * as UserController from "../app/controllers/userController.js";
import {authenticateUser} from "../app/middleware/authMiddleware.js";

import express from "express"
const router = express.Router();

//user routes
router.post("/register", UserController.Registration);
router.post("/login", UserController.Login);
router.get("/profile-details", authenticateUser, UserController.ProfileDetails);
router.put("/profile-update", authenticateUser, UserController.ProfileUpdate);
router.get("/email-verify", UserController.EmailVerify);
router.post("/otp-verify", UserController.OTPVerify);
router.post("/reset-password", UserController.ResetPassword);


//task routes
router.post("/create-task", authenticateUser, TaskController.CreateTask);
router.get("/reade-task/:id", authenticateUser, TaskController.ReadeTask);
router.put("/update-task/:id", authenticateUser, TaskController.UpdateTask);
router.delete("/delete-task/:id", authenticateUser, TaskController.DeleteTask);
router.get("/list-byStatus", authenticateUser, TaskController.TaskListByStatus);
router.put("/update-taskStatus/:id", authenticateUser, TaskController.UpdateTaskStatus);
router.get("/count-task", authenticateUser, TaskController.CountTask);
router.get("/task-list", authenticateUser, TaskController.TaskList);



export default router;