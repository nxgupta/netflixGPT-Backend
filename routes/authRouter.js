const {
  signUp,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const { updatePreferedLanguage } = require("../controllers/updatePreference");

let router = require("express").Router();
router.post("/signup", signUp);
router.post("/login", login);
router.get("/getCurrentUser", getCurrentUser);
router.post("/updatePreferedLang", updatePreferedLanguage);
module.exports = router;
