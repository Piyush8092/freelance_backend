

const getAll = async (req, res, modelName, refModelField = null, refSelect = "") => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = modelName.find().skip(skip).limit(limit);

    // ✅ Only apply populate if refModelField is passed
    if (refModelField) {
      query = query.populate(refModelField, refSelect);
    }

    const result = await query;
    const total = await modelName.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      message: `${modelName.modelName} fetched successfully`,
      status: 200,
      data: result,
      success: true,
      error: false,
      total,
      totalPages
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true
    });
  }
};

module.exports = { getAll };
