const { default: mongoose } = require("mongoose");
const { Order } = require("../models");
var express = require("express");
var moment = require("moment");
var router = express.Router();

const { findDocuments } = require("../helpers/MongoDBHelper");
mongoose.connect("mongodb://127.0.0.1:27017/MyLTH1-Practice");

//Phương thức POST: thêm mới data, gửi data lên server:
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Order(data);
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
    Order.find()
      .lean({ virtuals: true })
      .populate("orderDetails.product")
      .populate("customer")
      .populate("employee")
      .then((result) => {
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
    Order.findByIdAndDelete(id).then((result) => {
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
    Order.findByIdAndUpdate(id, data, { new: true })
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

//Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED:
router.get("/questions/7", function (req, res, next) {
  const query = { status: { $eq: "Completed" } };

  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/questions/7B", function (req, res, next) {
  const statusArray = ["Completed", "Canceled"];
  const query = { status: { $in: statusArray } };

  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED trong ngày hôm nay:
router.get("/questions/8", function (req, res, next) {
  const today = moment();
  const query = {
    $and: [
      { status: { $eq: "Completed" } },
      { createdDate: { $eq: new Date(today.format("YYYY-MM-DD")) } },
    ],
  };
  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Hiển thị tất cả các đơn hàng có trạng thái là <status> có ngày tạo trong khoảng <fromDate> và <toDate>:
router.get("/questions/8B", function (req, res, next) {
  try {
    let { status, fromDate, toDate } = req.query;

    fromDate = new Date(fromDate);

    const tmpToDate = new Date(toDate);
    toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

    const compareStatus = { $eq: ["$status", status] };
    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };
    //aggregate là một dạng mở rộng của Find:
    Order.aggregate([
      {
        //$match là so sánh khớp, $expr là một biểu thức, $and là operator logic
        $match: {
          $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
        },
      },
    ])
      .project({
        _id: 1,
        status: 1,
        paymentType: 1,
        createdDate: 1,
        orderDetails: 1,
        employeeId: 1,
        customerId: 1,
      })
      .then((result) => {
        //Populate hai trường customer và employee:
        Order.populate(result, [
          { path: "employee" },
          { path: "customer" },
          {
            path: "orderDetails.product",
            select: { name: 1, price: 1, discount: 1 },
          },
        ])
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      });
  } catch (err) {
    console.log(err);
  }
});

//Hiển thị tất cả các đơn hàng có trạng thái là CANCELED:
router.get("/questions/9", function (req, res, next) {
  const query = {
    status: { $eq: "Canceled" },
  };

  findDocuments({ query }, "orders")
    .then((results) => {
      res.json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Hiển thị tất cả các đơn hàng có trạng thái là CANCELED trong ngày hôm nay:
router.get("/questions/10", function (req, res, next) {
  const today = moment();

  const query = {
    $and: [
      { status: { $eq: "Canceled" } },
      {
        createdDate: { $eq: new Date(today.format("YYYY-MM-DD")) },
      },
    ],
  };

  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Hiển thị tất cả các đơn hàng có hình thức thanh toán là CASH:
router.get("/questions/11", function (req, res, next) {
  const query = {
    paymentType: { $eq: "Cash" },
  };

  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
//Hiển thị tất cả các đơn hàng có hình thức thanh toán là CREADIT CARD:
router.get("/questions/12", function (req, res, next) {
  const query = {
    paymentType: { $eq: "Credit Card" },
  };
  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
module.exports = router;
