const express = require("express");
const { getAllPosts, createPost, updatePost, deletePost, createComment, likeComment, getMyPosts } = require("../controllers/postController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/posts").get (isAuthenticatedUser,getAllPosts);
router.route("/my/posts").get (isAuthenticatedUser,getMyPosts);
router.route("/post/new").post(isAuthenticatedUser, createPost);
router.route("/post/:id").put(isAuthenticatedUser, updatePost).delete(isAuthenticatedUser, deletePost).post(isAuthenticatedUser,createComment);
router.route("/posts/:postId/comments/:commentId/like").post(isAuthenticatedUser,likeComment);
module.exports = router