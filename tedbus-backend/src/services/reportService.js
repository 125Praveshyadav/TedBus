const Report = require("../models/Report");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Discussion = require("../models/Discussion");
const Reply = require("../models/Reply");

const targetModelMap = {
  Post,
  Comment,
  Discussion,
  Reply,
};

const createReport = async ({ reportedBy, targetType, targetId, reason, description }) => {
  const Model = targetModelMap[targetType];

  const target = await Model.findOne({ _id: targetId, isDeleted: false });
  if (!target) {
    const error = new Error(`${targetType} not found`);
    error.statusCode = 404;
    throw error;
  }

  const existingReport = await Report.findOne({ reportedBy, targetId });
  if (existingReport) {
    const error = new Error("You have already reported this content");
    error.statusCode = 409;
    throw error;
  }

  const report = await Report.create({
    reportedBy,
    targetType,
    targetId,
    reason,
    description,
  });

  target.reportCount += 1;
  await target.save();

  return report;
};

const getReports = async (filters) => {
  const { page = 1, limit = 10, status, targetType, reason, sortBy = "latest" } = filters;
  const skip = (page - 1) * limit;

  const query = {};
  if (status) query.status = status;
  if (targetType) query.targetType = targetType;
  if (reason) query.reason = reason;

  const sort = sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const [reports, total] = await Promise.all([
    Report.find(query)
      .populate("reportedBy", "name email")
      .populate("reviewedBy", "name")
      .populate("targetId")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Report.countDocuments(query),
  ]);

  return {
    reports,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const updateReportStatus = async (reportId, status, reviewedBy) => {
  const report = await Report.findById(reportId);

  if (!report) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }

  report.status = status;
  report.reviewedBy = reviewedBy;
  await report.save();

  return report;
};

const removeReportedContent = async (reportId, adminId) => {
  const report = await Report.findById(reportId);

  if (!report) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }

  const Model = targetModelMap[report.targetType];
  await Model.findByIdAndUpdate(report.targetId, { isDeleted: true });

  report.status = "resolved";
  report.reviewedBy = adminId;
  await report.save();

  return report;
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
  removeReportedContent,
};