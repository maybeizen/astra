"use client";

import { useCallback } from "react";
import {
  useAlertContext,
  NotificationStyle,
  NotificationVariant,
} from "../contexts/AlertContext";

export const useNotification = () => {
  const { addNotification, removeNotification, clearNotifications } =
    useAlertContext();

  const notify = useCallback(
    (
      message: React.ReactNode,
      options?: {
        style?: NotificationStyle;
        variant?: NotificationVariant;
        icon?: React.ReactNode;
        duration?: number;
      }
    ) => {
      const {
        style = "primary",
        variant = "toast",
        icon,
        duration = 5000,
      } = options || {};
      return addNotification({
        message,
        style,
        variant,
        icon,
        duration,
      });
    },
    [addNotification]
  );

  const success = useCallback(
    (
      message: React.ReactNode,
      options?: Omit<Parameters<typeof notify>[1], "style">
    ) => {
      return notify(message, { ...options, style: "success" });
    },
    [notify]
  );

  const error = useCallback(
    (
      message: React.ReactNode,
      options?: Omit<Parameters<typeof notify>[1], "style">
    ) => {
      return notify(message, { ...options, style: "danger" });
    },
    [notify]
  );

  const warning = useCallback(
    (
      message: React.ReactNode,
      options?: Omit<Parameters<typeof notify>[1], "style">
    ) => {
      return notify(message, { ...options, style: "warning" });
    },
    [notify]
  );

  const info = useCallback(
    (
      message: React.ReactNode,
      options?: Omit<Parameters<typeof notify>[1], "style">
    ) => {
      return notify(message, { ...options, style: "info" });
    },
    [notify]
  );

  return {
    notify,
    success,
    error,
    warning,
    info,
    remove: removeNotification,
    clear: clearNotifications,
  };
};
