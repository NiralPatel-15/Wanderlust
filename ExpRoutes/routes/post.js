const express = require("express");
const router = express.Router();

//Posts
//Index Route
router.get("/", (req, res) => {
  res.send("Get for users");
});

//Show Route
router.get("/:id", (req, res) => {
  res.send("Get for posts id");
});

//Post Route
router.post("", (req, res) => {
  res.send("Post for  posts");
});

//Delete Route
router.delete("/:id", (req, res) => {
  res.send("Delete for post id");
});

module.exports = router;