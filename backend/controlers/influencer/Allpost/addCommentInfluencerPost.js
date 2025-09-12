const influencerPostModel = require('../../../Model/influencerPostModel');

// Add Comment to Influencer Post
const addCommentInfluencerPost = async (req, res) => {
  try {
    let id = req.params.id; // postId from URL
    let userId = req.user._id; // userId from auth middleware
    let payload = req.body;

    // Find the post
    let post = await influencerPostModel.findById(id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: 404,
        data: {},
        success: false,
        error: true
      });
    }

    // Validate required fields
    if (!payload.comment || !payload.comment.trim()) {
      return res.status(400).json({
        message: 'Comment is required',
        status: 400,
        data: {},
        success: false,
        error: true
      });
    }

    // Add new comment
    post.comments.push({
      userId: userId,
      comment: payload.comment.trim()
    });

    await post.save();

    // Populate the post with user details for response
    const populatedPost = await influencerPostModel.findById(id)
      .populate('userId', 'name email profileImage phone')
      .populate('likes.userId', 'name email profileImage')
      .populate('dislikes.userId', 'name email profileImage')
      .populate('shares.userId', 'name email profileImage')
      .populate('comments.userId', 'name email profileImage');

    res.status(200).json({
      message: 'Comment added successfully',
      status: 200,
      data: populatedPost,
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

module.exports = { addCommentInfluencerPost };