import { Food } from "../models/foodSchema.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/image/food");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

let upload = multer({ storage, fileFilter });

export const viewFood = async (req, res) => {
  try {
    const result = await Food.find({}).populate({
      path: "category_id",
      model: "food_category",
      strictPopulate: false,
    });
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const viewFoodByID = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Food.findById(id).populate({
      path: "category_id",
      model: "food_category",
      strictPopulate: false,
    });
    if (!result) {
      return res.status(404).send({ message: "Food not found!" });
    }
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const addFood = async (req, res) => {
  upload.single("food_image")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    try {
      const { food_name, food_price, food_description, category_id, popular } =
        req.body;
      const newFood = {
        food_name,
        food_price,
        food_description,
        category_id: category_id,
        popular,
      };
      if (req.file) {
        newFood.food_image = `/public/image/food/${req.file.filename}`;
      }
      const result = await Food.create(newFood);
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  });
};

export const updateFood = async (req, res) => {
  upload.single("food_image")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    try {
      const { id } = req.params;
      const { food_name, food_price, food_description, category_id, popular } =
        req.body;
      const updateFood = {
        food_name,
        food_price,
        food_description,
        category_id: category_id,
        popular,
      };
      if (req.file) {
        updateFood.food_image = `/public/image/food/${req.file.filename}`;
      }
      const result = await Food.findByIdAndUpdate(id, updateFood, {
        new: true,
      }).populate({
        path: "category_id",
        model: "food_category",
        strictPopulate: false,
      });
      if (!result) {
        return res.status(404).json({ message: "Food not found!" });
      }
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  });
};

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Food.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Food not found!" });
    }
    return res.status(200).send({ message: "Food deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const addFavorite = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).send({ message: "Food not found" });
    }
    food.favorite = !food.favorite;
    await food.save();
    res.send({ message: "Favorite status updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error updating favorite status" });
  }
};

export const getFavoriteFoods = async (req, res) => {
  try {
    const favoriteFoods = await Food.find({ favorite: true }).populate({
      path: "category_id",
      model: "food_category",
      strictPopulate: false,
    });
    return res.status(200).send(favoriteFoods);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getPopularFoods = async (req, res) => {
  try {
    const popularFoods = await Food.find({ popular: true }).populate({
      path: "category_id",
      model: "food_category",
      strictPopulate: false,
    });
    return res.status(200).send(popularFoods);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const searchFood = async (req, res) => {
  const { query } = req.query;
  try {
    const result = await Food.aggregate([
      {
        $lookup: {
          from: "food_categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          $or: [
            { food_name: { $regex: query, $options: "i" } },
            { "category.category_name": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          food_name: 1,
          food_price: 1,
          food_description: 1,
          category_id: 1,
          favorite: 1,
          popular: 1,
          food_image: 1,
          category_name: "$category.category_name",
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error searching for food", error });
  }
};