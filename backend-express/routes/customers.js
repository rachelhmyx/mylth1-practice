const { default: mongoose } = require("mongoose");
const { Customer } = require("../models");
var express = require("express");
const { findDocuments } = require("../helpers/MongoDBHelper");
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

//---------------------------------------------------------------------------------------------------//
//Hiện thị tất cả khách hàng có địa chỉ...:
router.get("/questions/4", function (req, res, next) {
  const addressArray = ["address 1", "address 2", "address 3"];
  const query = { address: { $in: addressArray } };
  findDocuments({ query }, "customers")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Hiển thị tất cả các khách hàng có năm sinh 2000:
router.get("/questions/5", function (req, res, next) {
  const query = {
    $expr: { $eq: [{ $year: "$birthday" }, 2000] },
  };

  findDocuments({ query }, "customers")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Hiển thị tất cả các khách hàng có sinh nhật là hôm nay:
router.get("/questions/6", function (req, res, next) {
  const today = new Date();
  const eqDay = { $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }] };
  const eqMonth = { $eq: [{ $month: "$birthday" }, { $month: today }] };

  const query = {
    $expr: { $and: [eqDay, eqMonth] },
  };

  findDocuments({ query }, "customers")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
