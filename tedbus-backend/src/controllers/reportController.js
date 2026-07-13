const reportService = require("../services/reportService");

const createReport = async (req, res, next) => {
  try {
    const report = await reportService.createReport({
      reportedBy: req.user._id,
      targetType: req.body.targetType,
      targetId: req.body.targetId,
      reason: req.body.reason,
      description: req.body.description,
    });

    res.status(201).json({ success: true, message: "Content reported successfully", report });
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const result = await reportService.getReports(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const updateReportStatus = async (req, res, next) => {
  try {
    const report = await reportService.updateReportStatus(
      req.params.id,
      req.body.status,
      req.user._id
    );
    res.status(200).json({ success: true, message: "Report status updated", report });
  } catch (error) {
    next(error);
  }
};

const removeReportedContent = async (req, res, next) => {
  try {
    const report = await reportService.removeReportedContent(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: "Reported content removed", report });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
  removeReportedContent,
};