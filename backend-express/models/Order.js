const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

//---------Order Details: ko phải là 1 collection riêng biệt mà đc gắn vào collection order:---------//
const orderDetailsSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 0, min: 0, required: true },
  price: { type: Number, default: 0, min: 0, required: true },
  discount: { type: Number, default: 0, max: 75 },
});

orderDetailsSchema.virtual("total").get(function () {
  return this.quantity * ((this.price * (100 - this.discount)) / 100);
});

orderDetailsSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

orderDetailsSchema.set("toObject", { virtuals: true });
orderDetailsSchema.set("toJSON", { virtuals: true });

//-------------------------------------Order Collection------------------------------------------------//
const orderSchema = new Schema({
  createdDate: { type: Date, required: true, default: Date.now },
  shippedDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        if (!value) {
          return true;
        }
        if (value < this.createdDate) {
          return false;
        }
        return true;
      },
      message: `Shipped Date: {VALUE} is invalid date!`,
    },
  },
  status: {
    type: String,
    default: "WAITING",
    validate: {
      validator: function (value) {
        return ["WAITING", "CANCELED", "COMPLETED"].includes(
          value.toUpperCase()
        );
      },
      message: `Status: {VALUE} is invalid status`,
    },
    required: true,
  },

  description: { type: String, maxLength: 500 },
  shippingAddress: { type: String, maxLength: 50 },
  paymentType: {
    type: String,
    validate: {
      validator: function (value) {
        return ["CASH", "CREDIT CARD"].includes(value.toUpperCase());
      },
      message: `Payment Type: {VALUE} is invalid payment type`,
    },
    required: true,
  },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  orderDetails: [orderDetailsSchema],
});

orderSchema.virtual("customer", {
  ref: "Customer",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("employee", {
  ref: "Employee",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});
orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });

orderSchema.plugin(mongooseLeanVirtuals);

const Order = model("Order", orderSchema);
module.exports = Order;
