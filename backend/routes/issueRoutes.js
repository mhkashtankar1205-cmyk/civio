const express = require("express");
const router = express.Router();

const {
  createIssue,
  getIssues,
  supportIssue,
  updateIssueStatus,
  getMyIssues
} = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");
router.get(
  "/my",
  authMiddleware,
  getMyIssues
);
// Public
router.get("/", getIssues);

// Protected
router.post("/", authMiddleware, createIssue);
router.post("/:id/support", authMiddleware, supportIssue);
router.patch(
  "/:id/status",
  authMiddleware,
  authMiddleware.adminProtect,
  updateIssueStatus
);
module.exports = router;