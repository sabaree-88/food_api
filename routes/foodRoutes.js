import { Router } from "express";
// import Auth from "../middleware/authMiddleware.js";
// import adminAuth from "../middleware/adminAuth.js";
import {
  viewFood,
  viewFoodByID,
  addFood,
  updateFood,
  deleteFood,
  getFavoriteFoods,
  addFavorite,
  getPopularFoods,
} from "../controllers/foodController.js";

const foodRoute = Router();

foodRoute.get("/view-food", viewFood);
foodRoute.get("/view-food/:id", viewFoodByID);
foodRoute.patch("/favorite/:id", addFavorite);
foodRoute.get("/get-favorite", getFavoriteFoods);
foodRoute.get("/get-popular_foods", getPopularFoods);
// foodRoute.use(Auth);
foodRoute.post("/add-food", addFood);
foodRoute.put("/edit-food/:id", updateFood);
foodRoute.delete("/rm-food/:id", deleteFood);

export default foodRoute;
