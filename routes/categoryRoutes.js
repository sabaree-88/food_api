import { Router } from "express";
// import Auth from "../middleware/authMiddleware.js";
// import adminAuth from "../middleware/adminAuth.js";
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
// categoryRouter.use(Auth);
categoryRouter.post("/add-categories", addCategory);
categoryRouter.put("/edit-categories/:id", updateCategory);
categoryRouter.delete("/rm-categories/:id", deleteCategory);

export default categoryRouter;
