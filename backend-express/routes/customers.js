const { default: mongoose } = require("mongoose");
const { Customer } = require("../models");
var express = require("express");
var router = express.Router();

mongoose.connect("mongodb://127.0.0.1:27017/MyLTH1-Practice");

//Phương thức POST: thêm mới data, gửi data lên server:
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Customer(data);
    newItem.save().then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.sendStatus(500);
    console.log("Error:", error);
  }
});

//Phương thức GET data:
router.get("/", function (req, res, next) {
  try {
    Customer.find().then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

//Phương thức DELETE:
router.delete("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    Customer.findByIdAndDelete(id).then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

//Phương thức PATCH:
router.patch("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    Customer.findByIdAndUpdate(id, data, { new: true })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
