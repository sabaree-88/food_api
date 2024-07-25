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
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    try {
      const { food_name, food_price, food_description, category_id } = req.body;
      const newFood = {
        food_name,
        food_price,
        food_description,
        category_id: category_id,
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
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    try {
      const { id } = req.params;
      const { food_name, food_price, food_description, category_id } = req.body;
      const updateFood = {
        food_name,
        food_price,
        food_description,
        category_id: category_id,
      };
      if (req.file) {
        updateFood.food_image = `public/image/food/${req.file.filename}`;
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
