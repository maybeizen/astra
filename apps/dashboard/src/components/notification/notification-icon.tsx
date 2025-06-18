"use client";

import React from "react";
import { NotificationStyle } from "../../contexts/AlertContext";

interface NotificationIconProps {
  style: NotificationStyle;
  customIcon?: React.ReactNode;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  style,
  customIcon,
}) => {
  if (customIcon) {
    return <div className="notification-icon flex-shrink-0">{customIcon}</div>;
  }

  const iconMap: Record<NotificationStyle, React.ReactNode> = {
    primary: <i className="fas fa-circle-info" />,
    secondary: <i className="fas fa-bell" />,
    info: <i className="fas fa-circle-info" />,
    success: <i className="fas fa-circle-check" />,
    warning: <i className="fas fa-triangle-exclamation" />,
    danger: <i className="fas fa-circle-exclamation" />,
  };

  const iconBgClasses: Record<NotificationStyle, string> = {
    primary: "bg-indigo-400/30",
    secondary: "bg-slate-400/30",
    info: "bg-blue-400/30",
    success: "bg-emerald-400/30",
    warning: "bg-amber-400/30",
    danger: "bg-rose-400/30",
  };

  return (
    <div
      className={`notification-icon flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${iconBgClasses[style]}`}
    >
      <span className="text-white text-lg">{iconMap[style]}</span>
    </div>
  );
};

export { NotificationIcon };
