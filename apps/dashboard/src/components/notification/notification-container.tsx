"use client";

import React from "react";
import { useAlertContext } from "../../contexts/AlertContext";
import { Notification } from "./notification";

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useAlertContext();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center justify-center gap-2 max-w-sm">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          variant={notification.variant}
          style={notification.style}
          icon={notification.icon}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        >
          {notification.message}
        </Notification>
      ))}
    </div>
  );
};

export { NotificationContainer };
