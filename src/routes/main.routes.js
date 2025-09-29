import {Router} from "express";
import authRouter from "./auth.routes.js";
import categoryRouter from "./carCategory.routes.js";
import carRouter from "./car.routes.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use('/category', categoryRouter);
mainRouter.use('/cars', carRouter)

export default mainRouter;