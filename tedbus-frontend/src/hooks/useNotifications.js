import { useState, useEffect, useCallback } from "react";
import notificationService from "../services/notificationService";
import { useSocket } from "../components/context/SocketContext";
import { toast } from "react-toastify";

const useNotifications = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(params);
      const fetched = data?.notifications || [];
      setNotifications((prev) =>
        params.page > 1 ? [...prev, ...fetched] : fetched
      );
      setPagination(data?.pagination || {});
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data?.unreadCount || 0);
    } catch (err) {
      console.error("Unread count error:", err);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const deleteAllRead = async () => {
    try {
      await notificationService.deleteAllRead();
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      toast.success("Read notifications cleared");
    } catch (err) {
      toast.error("Failed to clear");
    }
  };

  // Real-time: Socket se naya notification aaye toh list mein add karo
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Browser toast bhi dikhao
      toast.info(notification.title || "New notification", {
        position: "top-right",
        autoClose: 4000,
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  // Component mount pe unread count fetch karo
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    pagination,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  };
};

export default useNotifications;