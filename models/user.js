let mongoose = require("mongoose");
let bcrypt = require("bcrypt");

let UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  token: { type: String },
  createdDate: { type: Date, default: Date.now() },
  preferedLang: { type: String },
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("user", UserSchema);
