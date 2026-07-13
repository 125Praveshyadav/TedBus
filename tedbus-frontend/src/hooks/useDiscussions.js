import { useState, useCallback } from "react";
import discussionService from "../services/discussionService";
import { toast } from "react-toastify";

const useDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [singleDiscussion, setSingleDiscussion] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDiscussionsByForum = useCallback(async (forumId, params = {}) => {
    setLoading(true);
    try {
      const data = await discussionService.getDiscussionsByForum(forumId, params);
      setDiscussions(data.discussions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscussionById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await discussionService.getDiscussionById(id);
      setSingleDiscussion(data.discussion);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewDiscussion = async (forumId, payload) => {
    setLoading(true);
    try {
      await discussionService.createDiscussion(forumId, payload);
      toast.success("Discussion started!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating discussion");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    discussions,
    singleDiscussion,
    loading,
    fetchDiscussionsByForum,
    fetchDiscussionById,
    createNewDiscussion,
  };
};

export default useDiscussions;