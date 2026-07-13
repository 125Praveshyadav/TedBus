import { useState, useCallback } from "react";
import reportService from "../services/reportService";
import { toast } from "react-toastify";

const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // For Admins
  const fetchReports = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await reportService.getReports(params);
      setReports(data.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // For Normal Users
  const submitReport = async (payload) => {
    setLoading(true);
    try {
      await reportService.createReport(payload);
      toast.success("Report submitted to Admins. Thank you!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // For Admins
  const updateStatus = async (id, status) => {
    try {
      await reportService.updateReportStatus(id, status);
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return {
    reports,
    loading,
    fetchReports,
    submitReport,
    updateStatus,
  };
};

export default useReports;