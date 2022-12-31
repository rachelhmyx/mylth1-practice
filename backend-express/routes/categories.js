const { default: mongoose } = require("mongoose");
const { Category } = require("../models");
var express = require("express");
var router = express.Router();

const { findDocuments } = require("../helpers/MongoDBHelper");

mongoose.connect("mongodb://127.0.0.1:27017/MyLTH1-Practice");

//Phương thức POST: thêm mới data, gửi data lên server:
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Category(data);
    newItem.save().then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.sendStatus(500);
    console.log("Error:", error);
  }
});

//Phương thức GET data:

router.get("/", (req, res, next) => {
  try {
    Category.find().then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.sendStatus(500);
    console.log("Error:", error);
  }
});

//Phương thức DELETE:
router.delete("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    Category.findByIdAndDelete(id).then((result) => {
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
    Category.findByIdAndUpdate(id, data, { new: true })
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

//4-Hiện thị tất cả các sản phẩm của danh mục smart phone mà có  giá <= 5,000,000:
router.get("/questions/3b", function (req, res, next) {
  const aggregate = [
    {
      $lookup: {
        from: "products",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$id", "$categoryId"] },
                  { $gte: ["$price", 5000000] },
                ],
              },
            },
          },
        ],
        as: "products", //<output array field>
      },
    },

    // {
    //   $addFields: { numberOfProducts: { $size: "$products" } }, //Sử dụng $size khi muốn tính số phần tử trong một mảng.
    // },
  ];

  findDocuments({ aggregate: aggregate }, "categories")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

//Hiện thị tên hàng hóa cho mỗi danh mục:
router.post("/questions/18B", function (req, res, next) {
  try {
    const { name } = req.body;
    const query = {
      name: name,
    };
    console.log(name);
    Category.aggregate([
      { query },
      {
        $lookup: {
          from: "products",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$categoryId"] },
              },
            },
          ],
          as: "products", //<output array field>
        },
      },
      {
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (err) {
    res.json(err);
  }
});
module.exports = router;
