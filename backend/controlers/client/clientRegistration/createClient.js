 const ClientModel = require("../../../Model/clientRegistrationModel");
// POST request to create client profile
const CreateClient = async (req, res) => {
  try {
    let payload = req.body;

    // --- Basic required fields ---
    if (
      !payload.profileImage ||
      !payload.selectCategory ||
       payload.allowCallInApp === undefined ||
      payload.allowCallViaPhone === undefined ||
      payload.allowChat === undefined
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // --- Conditional validation based on profile type ---
    if (payload.profileType === "Service Profile") {
      if (!payload.description) {
        return res
          .status(400)
          .json({ message: "Description is required for Service Profile" });
      }
    }

    if (payload.profileType === "Business Profile") {
      if (!payload.businessName) {
        return res
          .status(400)
          .json({ message: "Business name is required for Business Profile" });
      }
      if (!payload.establishedInYear) {
        return res
          .status(400)
          .json({ message: "Established in year is required for Business Profile" });
      }
      if (!payload.workBusinessImages || payload.workBusinessImages.length === 0) {
        return res
          .status(400)
          .json({ message: "Work/Business images are required for Business Profile" });
      }
    }

    // --- Validate phone number when call via phone is enabled ---
    if (payload.allowCallViaPhone === true && !payload.phoneNumberForCalls) {
      return res.status(400).json({
        message: "Phone number is required when call via phone is enabled"
      });
    }

    // --- Attach user info from authGuard ---
    payload.userId = req.user._id;
    if (!payload.email) {
      payload.email = req.user.email;
    }
    if (!payload.name) {
      payload.name = req.user.name;
    }
    if (!payload.phoneNumberForCalls && req.user.phone) {
      payload.phoneNumberForCalls = req.user.phone;
    }
    payload.profileType = "client"; // Set default as per model

    // --- Save profile ---
    const newClient = new ClientModel(payload);
    const result = await newClient.save();

    res.json({
      message: "Client profile created successfully",
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

module.exports = { CreateClient };
