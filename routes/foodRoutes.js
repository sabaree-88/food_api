import { Router } from "express";
import {
  viewFood,
  viewFoodByID,
  addFood,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";

const foodRoute = Router();

foodRoute.get("/view-food", viewFood);
foodRoute.get("/view-food/:id", viewFoodByID);
foodRoute.post("/add-food", addFood);
foodRoute.put("/edit-food/:id", updateFood);
foodRoute.delete("/rm-food/:id", deleteFood);

export default foodRoute;
