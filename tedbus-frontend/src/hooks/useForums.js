import { useState, useCallback } from "react";
import forumService from "../services/forumService";

const useForums = () => {
  const [forums, setForums] = useState([]);
  const [singleForum, setSingleForum] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchForums = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await forumService.getForums(params);
      setForums(data.forums);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForumBySlug = useCallback(async (slug) => {
    setLoading(true);
    try {
      const data = await forumService.getForumBySlug(slug);
      setSingleForum(data.forum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { forums, singleForum, loading, fetchForums, fetchForumBySlug };
};

export default useForums;