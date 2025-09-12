const influencerPostModel = require('../../../Model/influencerPostModel');

// Delete Comment from Influencer Post
const deleteCommentInfluencerPost = async (req, res) => {
  try {
    let postId = req.params.id; // postId from URL
    let commentId = req.params.commentId; // commentId from URL
    let userId = req.user._id; // userId from auth middleware

    // Find the post
    let post = await influencerPostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: 404,
        data: {},
        success: false,
        error: true
      });
    }

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
        status: 404,
        data: {},
        success: false,
        error: true
      });
    }

    // Check if user owns the comment or the post
    if (comment.userId.toString() !== userId.toString() && post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own comments or comments on your posts',
        status: 403,
        data: {},
        success: false,
        error: true
      });
    }

    // Remove the comment
    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({
      message: 'Comment deleted successfully',
      status: 200,
      data: post,
      success: true,
      error: false
    });
  } catch (e) {
    res.status(500).json({
      message: 'Something went wrong',
      status: 500,
      data: e.message,
      success: false,
      error: true
    });
  }
};

module.exports = { deleteCommentInfluencerPost };