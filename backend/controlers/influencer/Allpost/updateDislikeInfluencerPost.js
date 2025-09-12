const influencerPostModel = require('../../../Model/influencerPostModel');

// Update Dislike for Influencer Post
const updateDislikeInfluencerPost = async (req, res) => {
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

    // Prevent post owner from disliking own post
    if (post.userId.toString() === userId.toString()) {
      return res.status(403).json({
        message: 'You cannot dislike your own post',
        status: 403,
        data: {},
        success: false,
        error: true
      });
    }

    // Check if already disliked by this user
    const alreadyDisliked = post.dislikes.some(
      (d) => d.userId.toString() === userId.toString()
    );

    // Handle dislike toggle
    if (payload.dislike === false) {
      // Remove dislike if exists
      if (alreadyDisliked) {
        post.dislikes = post.dislikes.filter(
          (d) => d.userId.toString() !== userId.toString()
        );
        await post.save();
        return res.status(200).json({
          message: 'Dislike removed successfully',
          status: 200,
          data: post,
          success: true,
          error: false
        });
      } else {
        return res.status(400).json({
          message: 'You have not disliked this post yet',
          status: 400,
          data: {},
          success: false,
          error: true
        });
      }
    }

    // Add dislike (payload.dislike === true or undefined)
    if (alreadyDisliked) {
      return res.status(400).json({
        message: 'You already disliked this post',
        status: 400,
        data: {},
        success: false,
        error: true
      });
    }

    // Add dislike with default value true
    post.dislikes.push({ 
      userId: userId,
      dislike: true
    });

    // Remove like if the same user had liked before
    post.likes = post.likes.filter(
      (l) => l.userId.toString() !== userId.toString()
    );

    await post.save();

    res.status(200).json({
      message: 'Dislike added successfully',
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

module.exports = { updateDislikeInfluencerPost };