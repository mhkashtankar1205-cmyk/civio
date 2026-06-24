const Issue = require("../models/Issue");

// Create Issue
const createIssue = async (req, res) => {
  try {
    const issueData = {
      ...req.body,
      reportedBy: req.user.userId,
      beforeImage: req.body.image || "",
      statusHistory: [{ status: "Pending", timestamp: new Date() }]
    };
    
    if (req.body.locationDetails) {
      issueData.locationDetails = req.body.locationDetails;
    }
    
    if (req.body.geoLocation) {
      issueData.geoLocation = req.body.geoLocation;
    }

    const issue = await Issue.create(issueData);

    res.status(201).json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Issues
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("reportedBy", "_id name email area")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const supportIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const alreadySupported = issue.supporters.includes(
      req.user.userId
    );

    if (alreadySupported) {
      return res.status(400).json({
        success: false,
        message: "Already supported",
      });
    }

    issue.supporters.push(req.user.userId);

    await issue.save();

    res.json({
      success: true,
      supporters: issue.supporters.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateIssueStatus = async (req, res) => {
  try {
    const { status, afterImage, adminNotes } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    if (adminNotes !== undefined) {
      issue.adminNotes = adminNotes;
    }

    if (status) {
      // Status Flow validation:
      // Pending -> Under Review
      // Under Review -> In Progress
      // In Progress -> Resolved
      const currentStatus = issue.status;
      let isValidTransition = false;
      if (currentStatus === "Pending" && status === "Under Review") isValidTransition = true;
      else if (currentStatus === "Under Review" && status === "In Progress") isValidTransition = true;
      else if (currentStatus === "In Progress" && status === "Resolved") isValidTransition = true;

      if (!isValidTransition) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${currentStatus} to ${status}.`,
        });
      }

      // Resolved requires afterImage
      if (status === "Resolved") {
        const finalAfterImage = afterImage || issue.afterImage;
        if (!finalAfterImage) {
          return res.status(400).json({
            success: false,
            message: "An after image is required to mark the issue as Resolved.",
          });
        }
        issue.afterImage = finalAfterImage;
      }

      issue.status = status;
      if (!issue.statusHistory) {
        issue.statusHistory = [];
      }
      issue.statusHistory.push({ status, timestamp: new Date() });
    }

    await issue.save();

    res.json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      reportedBy: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  createIssue,
  getIssues,
  supportIssue,
  updateIssueStatus,
  getMyIssues,
};