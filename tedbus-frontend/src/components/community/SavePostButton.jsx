import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import useProfile from "../../hooks/useProfile";
import { useAuth } from "../../components/context/AuthContext";
import { toast } from "react-toastify";

const SavePostButton = ({ postId, initialSaved = false }) => {
  const { user } = useAuth();
  const { toggleSave } = useProfile();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleClick = async () => {
    if (!user) return toast.error("Please login to save posts");
    if (loading) return;

    setLoading(true);
    const previousState = isSaved;
    setIsSaved(!previousState); // Optimistic update

    try {
      const result = await toggleSave(postId);
      if (result === null) {
        setIsSaved(previousState); // Revert on error
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2.5 rounded-2xl font-bold transition-all active:scale-90 ${
        isSaved
          ? "bg-red-50 text-red-600"
          : "bg-white text-slate-500 hover:text-red-600 shadow-[2px_2px_6px_rgba(0,0,0,0.05)]"
      }`}
      title={isSaved ? "Remove from saved" : "Save post"}
    >
      <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
    </button>
  );
};

export default SavePostButton;