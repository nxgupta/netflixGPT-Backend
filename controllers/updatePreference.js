let User = require("../models/user");
let updatePreferedLanguage = async (req, res) => {
  try {
    let { uId, preferedLang } = req.body;
    let response = await User.updateOne(
      { _id: uId },
      {
        $set: {
          preferedLang,
        },
      }
    );
    if (!response)
      return res.json({
        success: false,
        msg: "Something went wrong, Please try again",
      });
    req.session.preferedLang = preferedLang;
    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updatePreferedLanguage,
};
