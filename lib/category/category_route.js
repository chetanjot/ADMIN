const express = require("express");
const router = express.Router();
const categoryController = require("./category_controller");
const categoryValidator = require("./category_validator");

/*Add category*/
/*validation missing*/
router.post("/",categoryController.addCategory);

/*Get category details*/
router.get("/",categoryController.categories);

/*Delete category*/
router.delete("/:id",categoryController.deleteCategory);

/*Get category details*/
router.get("/:id",categoryController.categoryDetails);


module.exports = router;