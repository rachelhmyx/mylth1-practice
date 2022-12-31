const { default: mongoose } = require("mongoose");
const { Product } = require("../models");
var express = require("express");
var router = express.Router();

const { findDocuments } = require("../helpers/MongoDBHelper");

mongoose.connect("mongodb://127.0.0.1:27017/MyLTH1-Practice");

//Phương thức POST: thêm mới data, gửi data lên server:
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Product(data);
    newItem
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  } catch (error) {
    res.sendStatus(500);
    console.log("Error:", error);
  }
});

//Phương thức GET data:
router.get("/", function (req, res, next) {
  try {
    Product.find()
      // .skip(1) //Bỏ qua 1 object
      // .limit(3) //Chỉ lấy giới hạn 3 object cho 1 trang
      .lean({ virtuals: true })
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send(result);
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//Phương thức DELETE:
router.delete("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    Product.findByIdAndDelete(id).then((result) => {
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
    Product.findByIdAndUpdate(id, data, { new: true })
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

//--------------------------------------------------------------------------------------------------//
//QUERY:
//1-Hiện thị tất cả các mặt hàng có giảm giá <=10%:
router.get("/questions/1", function (req, res, next) {
  const query = { discount: { $lte: 10 } };
  findDocuments({ query }, "products")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//2-Hiển thị tất cả các mặt hàng có stock <= 500:
router.get("/questions/2", function (req, res, next) {
  const query = { stock: { $lte: 500 } };
  findDocuments({ query }, "products")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//3-Hiển thị tất cả các mặt hàng có giá bán sau khi đã giảm giá <= 2.000.000:
router.get("/questions/3", async (req, res, next) => {
  try {
    const s = { $subtract: [100, "$discount"] };
    const m = { $multiply: ["$price", s] };
    const d = { $divide: [m, 100] };

    let aggregate = [{ $match: { $expr: { $lte: [d, 2000000] } } }];

    const result = await findDocuments({ aggregate }, "products");
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
