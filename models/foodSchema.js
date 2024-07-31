import mongoose from "mongoose";

const food = mongoose.Schema({
  food_name: {
    type: String,
    required: true,
  },
  food_price: {
    type: Number,
    required: true,
  },
  food_image: {
    type: String,
  },
  food_description: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "food_category",
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  popular: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no',
  },
});

export const Food = mongoose.model("food", food);
