const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const employeeSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: {
    type: Number,
    validate: {
      validator: function (value) {
        const phoneNumberRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
        return phoneNumberRegex.test(value);
      },
      message: `{VALUE} is invalid email!`,
    },
    required: true,
    unique: true,
  },
  address: { type: String },
  email: {
    type: String,
    validate: {
      validator: function (value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: `{VALUE} is invalid email!`,
    },
    required: true,
    unique: true,
  },
  birthday: {
    type: Date,
    validate: {
      validator: function (value) {
        const today = new Date();
        if (value > today) {
          return false;
        }
        return true;
      },
      message: `{VALUE} is invalid birthday`,
    },
    required: false,
    unique: true,
  },
});

employeeSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

employeeSchema.set("toObject", { virtuals: true });
employeeSchema.set("toJSON", { virtuals: true });

employeeSchema.plugin(mongooseLeanVirtuals);

const Employee = model("Employee", employeeSchema);
module.exports = Employee;
