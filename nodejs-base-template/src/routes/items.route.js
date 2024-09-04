const express = require("express");
const router = express.Router();

// controller
const ItemsController = require("../controllers/items.controller");

// @route    GET api/items
// @desc     Get items list
// @access   Public
router.get("/", ItemsController.getItems);

// @route    GET api/items/:id
// @desc     Get item
// @access   Public
router.get("/:id", ItemsController.getItem);

// @route    POST api/items
// @desc     Create new item
// @access   Public
router.post("/", ItemsController.createItem);

// @route    PUT api/items/:id
// @desc     Update item
// @access   Public
router.put("/:id", ItemsController.updateItem);

// @route    DELETE api/items/:id
// @desc     Delete item
// @access   Public
router.delete("/:id", ItemsController.softDeleteItem);

module.exports = router;
