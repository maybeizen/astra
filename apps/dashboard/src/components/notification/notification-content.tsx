"use client";

import React from "react";
import {
  NotificationStyle,
  NotificationVariant,
} from "../../contexts/AlertContext";

interface NotificationContentProps {
  style: NotificationStyle;
  variant: NotificationVariant;
  children: React.ReactNode;
}

const NotificationContent: React.FC<NotificationContentProps> = ({
  style,
  variant,
  children,
}) => {
  return (
    <div
      className={`notification-content notification-content-${style} notification-content-${variant} text-white text-sm`}
    >
      {children}
    </div>
  );
};

export { NotificationContent };
