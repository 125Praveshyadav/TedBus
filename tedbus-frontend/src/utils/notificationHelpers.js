import {
  Heart,
  MessageCircle,
  MessageSquare,
  Ticket,
  XCircle,
  Clock,
  AlertTriangle,
  Gift,
  Bell,
} from "lucide-react";

export const notificationConfig = {
  community_like: {
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  community_comment: {
    icon: MessageCircle,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  community_reply: {
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  booking_confirmed: {
    icon: Ticket,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  booking_cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  journey_reminder: {
    icon: Clock,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  schedule_changed: {
    icon: AlertTriangle,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  promotional: {
    icon: Gift,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  system: {
    icon: Bell,
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};

export const getNotificationConfig = (type) => {
  return notificationConfig[type] || notificationConfig.system;
};

export const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};