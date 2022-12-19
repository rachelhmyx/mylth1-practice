const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals"); //set up Virtuals

const productSchema = new Schema({
  name: { type: String, required: true },
  stock: { type: Number, min: 0, default: 0 },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: 0,
    default: 0,
  },
  discount: { type: Number, min: 0, max: 75, default: 0 },
  description: { type: String },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  supplierId: { type: Schema.Types.ObjectId, ref: "Supplier" },
});

//Tạo một trường ảo tên total để tính tiền của sản phẩm sau khi discount, cái trường ảo "total" này sẽ chỉ xuất hiện khi mình call API ra trên postman chứ không xuất hiện trong Database MongoDB:
productSchema.virtual("total").get(function () {
  return (this.price * (100 - this.discount)) / 100;
});

productSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("supplier", {
  ref: "Supplier",
  localField: "supplierId",
  foreignField: "_id",
  justOne: true,
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

productSchema.plugin(mongooseLeanVirtuals);

const Product = model("Product", productSchema);
module.exports = Product;
