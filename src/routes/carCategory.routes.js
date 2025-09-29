import {Router} from "express";
import categoryController from "../controller/carCategory.controller.js";
import {checkAccessToken} from "../middleware/checkAccessToken.js";
import uploadCategory from "../middleware/upload.js";

const categoryRouter = Router();

categoryRouter.get("/get/all", categoryController.GET_ALL);
categoryRouter.post("/create", checkAccessToken, uploadCategory.single('logo'), categoryController.CREATE_CATEGORY);
categoryRouter.put("/update/:id", checkAccessToken, uploadCategory.single('logo'), categoryController.UPDATE_CATEGORY);
categoryRouter.delete("/delete/:id", checkAccessToken, categoryController.DELETE_CATEGORY);

export default categoryRouter;
