"use client";

import React from "react";
import { useAlertContext } from "../../contexts/AlertContext";
import { Notification } from "./notification";

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useAlertContext();

  const toastNotifications = notifications.filter((n) => n.variant === "toast");
  const bannerNotifications = notifications.filter(
    (n) => n.variant === "banner"
  );
  const textNotifications = notifications.filter((n) => n.variant === "text");

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        {toastNotifications.map((notification) => (
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

      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        {bannerNotifications.map((notification) => (
          <div key={notification.id} className="w-full">
            <Notification
              id={notification.id}
              variant={notification.variant}
              style={notification.style}
              icon={notification.icon}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            >
              {notification.message}
            </Notification>
          </div>
        ))}
      </div>

      {textNotifications.length > 0 && (
        <div className="notification-text-container">
          {textNotifications.map((notification) => (
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
      )}
    </>
  );
};

export { NotificationContainer };
