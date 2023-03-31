const express = require("express");

const { createUser, loginUser, logoutUser, getUserdetails, updatePassword, updateProfile, deleteAccount, AllUsers } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/user/new").post(createUser);
router.route("/users").get(AllUsers);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser,getUserdetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/account/delete").delete(isAuthenticatedUser,deleteAccount);
module.exports = router