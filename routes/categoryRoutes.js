import { Router } from "express";
import {
  viewCategory,
  viewCategoryByID,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/foodCategoryController.js";

const categoryRouter = Router();

categoryRouter.get("/get-categories", viewCategory);
categoryRouter.get("/get-categories/:id", viewCategoryByID);
categoryRouter.post("/add-categories", addCategory);
categoryRouter.put("/edit-categories/:id", updateCategory);
categoryRouter.delete("/rm-categories/:id", deleteCategory);

export default categoryRouter;
