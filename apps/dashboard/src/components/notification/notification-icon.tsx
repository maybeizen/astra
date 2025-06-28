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
    primary: <i className="fas fa-info" />,
    secondary: <i className="fas fa-bell" />,
    info: <i className="fas fa-info" />,
    success: <i className="fas fa-check" />,
    warning: <i className="fas fa-exclamation-triangle" />,
    danger: <i className="fas fa-exclamation-circle" />,
  };

  const iconColorClasses: Record<NotificationStyle, string> = {
    primary: "text-blue-400",
    secondary: "text-gray-400",
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
  };

  return (
    <div
      className={`notification-icon flex-shrink-0 flex items-center justify-center h-5 w-5 ${iconColorClasses[style]}`}
    >
      <span className="text-base">{iconMap[style]}</span>
    </div>
  );
};

export { NotificationIcon };
