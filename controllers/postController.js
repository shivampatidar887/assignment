const Post = require("../models/postModel");
const catchasyncerror = require("../middleware/catchasyncerror")
// Create new Post (only logged in user)
exports.createPost = catchasyncerror(async(req,res,next)=>{
    req.body.user=req.user.id;
    const post= await Post.create(req.body);
    res.status(201).json({
        success:true,
        post,
    })
});

// Get All Posts
exports.getAllPosts = catchasyncerror(async(req,res)=>{
    const posts = await Post.find();
    res.status(200).json({
        success:true,
        posts,
    })
}) ;
// Get my Posts
exports.getMyPosts = catchasyncerror(async (req, res) => {
    const posts = await Post.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      posts,
    });
  });
// Update Post (only creator of the post)
exports.updatePost =catchasyncerror(async (req, res, next) => {
    let post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(500).json({
            success:false,
            message:"Post Not Found with this id"
        })
    }
    if(post.user.toString()!==req.user.id){
        return res.status(404).json({
            success:false,
            message:"You cannot update other's Post"
        })
    }
    req.body.updatedAt=Date.now();
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        post
    })
}) ;

// Delete Post (only creator of the post) 
exports.deletePost =catchasyncerror(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({
            success:false,
            message:"Post Not Found with this id"
        })
      }
    
    if(post.user.toString()!==req.user.id){
        return res.status(404).json({
            success:false,
            message:"You cannot delete other's Post"
        })
    }

      await Post.findByIdAndDelete(post._id);
    
      res.status(200).json({
        success: true,
        message: "Post Delete Successfully",
      });
});

// Comment on a post
exports.createComment = catchasyncerror(async (req, res, next) => {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }
    const newcomment = {
      sentBy: req.user._id,
      comment: comment,
    };
  
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    post.comments.push(newcomment);
    await post.save();
  
    res.status(200).json({
      success: true,
      message: "Comment created successfully",
    });
  });
// Like A Comment
exports.likeComment = catchasyncerror(async (req, res, next) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
  
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }
  
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment Not Found",
      });
    }
  
    const user= req.user._id;
    
    const user_id = user.toString(); // assuming user is defined
    let isLiked=false;
    
    for (let i = 0; i < comment.likedby.length; i++) {
        const element = comment.likedby[i];
        if (element.user.toString() === user_id) {
          isLiked = true;
          break;
        }
      }  
    if (isLiked) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this comment",
      });
    }
    comment.likedby.push({user});
    await post.save();
    res.status(200).json({
      success: true,
      message: "Comment liked successfully",
    });
  });
  
  