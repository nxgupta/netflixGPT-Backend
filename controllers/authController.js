let User = require("../models/user");
let signUp = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let userExists = await User.findOne({ email }).lean();
    if (userExists)
      return res
        .status(200)
        .json({ success: false, msg: "Account already exists" });
    await User.create({
      name,
      email,
      password,
    });
    return res
      .status(200)
      .json({ success: true, msg: "Successfully signed up, Please login!" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrong, please try again later",
    });
  }
};
let login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      let passwordMatched = await user.comparePassword(password);
      if (passwordMatched) {
        req.session.isAuthenticated = true;
        req.session.uId = user._id;
        req.session.preferedLang = user.preferedLang;
        return res
          .status(200)
          .json({ success: true, uId: user._id, msg: "login successful" });
      } else {
        return res
          .status(401)
          .json({ success: false, msg: "Invalid Credentials" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Account does not exist" });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrong, please try again later",
    });
  }
};
let validateUser = async (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(400).json({
      status: false,
      msg: "Please login again",
    });
  }
};
let getCurrentUser = async (req, res, next) => {
  if (req.session.isAuthenticated) {
    return res.status(200).json({
      uId: req.session.uId,
      preferedLang: req.session.preferedLang,
    });
  } else {
    res.json({
      status: false,
      msg: "Please login again",
    });
  }
};

module.exports = {
  signUp,
  login,
  validateUser,
  getCurrentUser,
};
