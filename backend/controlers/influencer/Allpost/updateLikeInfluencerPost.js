const influencerPostModel = require('../../../Model/influencerPostModel');

// Update Like for Influencer Post
const updateLikeInfluencerPost = async (req, res) => {
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

    // Prevent self-like
    if (post.userId.toString() === userId.toString()) {
      return res.status(403).json({
        message: 'You cannot like your own post',
        status: 403,
        data: {},
        success: false,
        error: true
      });
    }

    // Check if already liked
    const alreadyLiked = post.likes.some(
      (l) => l.userId.toString() === userId.toString()
    );

    // Handle like toggle
    if (payload.like === false) {
      // Remove like if exists
      if (alreadyLiked) {
        post.likes = post.likes.filter(
          (l) => l.userId.toString() !== userId.toString()
        );
        await post.save();
        return res.status(200).json({
          message: 'Like removed successfully',
          status: 200,
          data: post,
          success: true,
          error: false
        });
      } else {
        return res.status(400).json({
          message: 'You have not liked this post yet',
          status: 400,
          data: {},
          success: false,
          error: true
        });
      }
    }

    // Add like (payload.like === true or undefined)
    if (alreadyLiked) {
      return res.status(400).json({
        message: 'You already liked this post',
        status: 400,
        data: {},
        success: false,
        error: true
      });
    }

    // Add like with default value true
    post.likes.push({ 
      userId: userId,
      like: true
    });

    // Remove dislike if the same user had disliked before
    post.dislikes = post.dislikes.filter(
      (d) => d.userId.toString() !== userId.toString()
    );

    await post.save();

    res.status(200).json({
      message: 'Like added successfully',
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

module.exports = { updateLikeInfluencerPost };