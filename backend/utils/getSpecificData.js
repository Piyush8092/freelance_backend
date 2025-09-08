const getSpecificData = async (req, res, modelName, refModelField = null, refSelect = "") => {
  try {
    const { id } = req.params;

    let query = modelName.findById(id);

    // ✅ Only apply populate if refModelField is passed
    if (refModelField) {
      query = query.populate(refModelField, refSelect);
    }

    const result = await query;

    if (!result) {
      return res.status(404).json({
        message: `${modelName.modelName} not found`,
        status: 404,
        data: {},
        success: false,
        error: true,
      });
    }

    res.json({
      message: `${modelName.modelName} fetched successfully`,
      status: 200,
      data: result,
      success: true,
      error: false,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true,
    });
  }
};

module.exports = { getSpecificData };
