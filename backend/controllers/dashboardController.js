const Issue = require("../models/Issue");

const getDashboardStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();

    const pendingIssues = await Issue.countDocuments({
      status: "Pending",
    });

    const inProgressIssues = await Issue.countDocuments({
      status: "In Progress",
    });

    const resolvedIssues = await Issue.countDocuments({
      status: "Resolved",
    });

    res.json({
      success: true,
      stats: {
        totalIssues,
        pendingIssues,
        inProgressIssues,
        resolvedIssues,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};