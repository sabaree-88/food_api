import mongoose from "mongoose";

const foodCategory = mongoose.Schema({
  category_name: {
    type: String,
    required: true,
  },
  category_image: {
    type: String,
  },
});

export const Category = mongoose.model("food_category", foodCategory);
