 const InfluencerModel = require("../../../Model/InfluencerRegiestrationModel");

// POST request to create influencer profile
const CreateInfluencer = async (req, res) => {
  try {
    let payload = req.body;
let Id = req.user._id;
let existClient=await InfluencerModel.findOne({userId:Id});
if(existClient){
    return res.status(400).json({ message: "Client already exists" });
}    // --- Basic required fields ---
    if (
      !payload.profileImage ||
      !payload.selectCategory ||
      !payload.locationURL ||
      payload.allowCallInApp === undefined ||
      payload.allowCallViaPhone === undefined ||
      payload.allowChat === undefined
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // --- Conditional validation for Service Profile ---
    if (payload.profileType === "Service Profile") {
      if (!payload.description) {
        return res
          .status(400)
          .json({ message: "Description is required for Service Profile" });
      }
      if (!payload.experience) {
        return res
          .status(400)
          .json({ message: "Experience is required for Service Profile" });
      }
    }

    // --- Attach user info from authGuard ---
    payload.userId = req.user._id;
    payload.email = req.user.email;
    payload.name = req.user.name;
    payload.phoneNumberForCalls = req.user.phone;
    payload.profileType = "influencer"; // Set default as per model

    // --- Save profile ---
    const newInfluencer = new InfluencerModel(payload);
    const result = await newInfluencer.save();

    res.json({
      message: "Influencer profile created successfully",
      status: 200,
      data: result,
      success: true,
      error: false,
    });
  } catch (e) {
    // Handle validation errors
    if (e.name === "ValidationError") {
      const errors = Object.values(e.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        status: 400,
        data: errors,
        success: false,
        error: true,
      });
    }

    res.status(500).json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { CreateInfluencer };
