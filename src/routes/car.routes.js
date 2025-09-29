
import {Router} from "express";
import carController from "../controller/car.controller.js";
import { checkAccessToken } from "../middleware/checkAccessToken.js";
import upload from "../middleware/upload.js";

const carRouter = Router();

carRouter.get("/get/all", carController.GET_ALL);
carRouter.get("/get/:id", carController.GET_CAR_BY_ID);
carRouter.post("/create", checkAccessToken, upload.single("photo"), carController.CREATE_CAR);
carRouter.put("/update/:id", checkAccessToken, upload.single("photo"), carController.UPDATE_CAR);
carRouter.delete("/delete/:id", checkAccessToken, carController.DELETE_CAR);

export default carRouter;
