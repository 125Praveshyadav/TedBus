import { useState, useCallback } from "react";
import preferenceService from "../services/preferenceService";
import { toast } from "react-toastify";

const usePreferences = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const data = await preferenceService.getPreferences();
      setPreferences(data?.preference || null);
    } catch (err) {
      console.error("Preferences fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = async (updateData) => {
    try {
      const data = await preferenceService.updatePreferences(updateData);
      setPreferences(data?.preference || preferences);
      toast.success("Preferences updated");
      return true;
    } catch (err) {
      toast.error("Failed to update preferences");
      return false;
    }
  };

  return {
    preferences,
    loading,
    fetchPreferences,
    updatePreferences,
  };
};

export default usePreferences;