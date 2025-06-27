"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationVariant = "toast";
export type NotificationStyle =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface NotificationProps {
  id: string;
  variant: NotificationVariant;
  style: NotificationStyle;
  message: React.ReactNode;
  icon?: React.ReactNode;
  duration?: number;
  onClose?: () => void;
}

interface AlertContextType {
  notifications: NotificationProps[];
  addNotification: (notification: Omit<NotificationProps, "id">) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const addNotification = useCallback(
    (notification: Omit<NotificationProps, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newNotification = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);

      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, notification.duration);
      }

      return id;
    },
    [removeNotification]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <AlertContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
