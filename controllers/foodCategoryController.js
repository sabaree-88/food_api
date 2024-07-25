import { Category } from "../models/foodCategory.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/image/category");
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

export const viewCategory = async (req, res) => {
  try {
    const result = await Category.find({});
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const viewCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.findById(id);
    if (!result) {
      return res.status(404).send({ message: "Category not found!" });
    }
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const addCategory = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    try {
      const newCategory = { category_name: req.body.category_name };
      if (req.file) {
        newCategory.category_image = `/public/image/category/${req.file.filename}`;
      }
      const result = await Category.create(newCategory);
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  });
};

export const updateCategory = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    try {
      const { id } = req.params;
      const { category_name } = req.body();
      const updateCategory = { category_name };
      if (req.file) {
        updateCategory.category_image = `http://localhost:8080/public/image/category/${req.file.filename}`;
      }
      const result = await Category.findByIdAndUpdate(id, updateCategory, {
        new: true,
      });
      if (!result) {
        return res.status(404).json({ message: "Category not found!" });
      }
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  });
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Category not found!" });
    }
    return res.status(200).send({ message: "Category deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};
