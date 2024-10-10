const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { collection: "peoples", toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Hide the _id and __v fields by default
UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set("toObject", {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
