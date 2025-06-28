"use client";

import React, { useEffect, useState } from "react";
import {
  NotificationStyle,
  NotificationVariant,
} from "../../contexts/AlertContext";
import { NotificationIcon } from "./notification-icon";
import { NotificationContent } from "./notification-content";

interface NotificationProps {
  id?: string;
  variant: NotificationVariant;
  style: NotificationStyle;
  icon?: React.ReactNode;
  duration?: number;
  children: React.ReactNode;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  variant,
  style,
  icon,
  duration = 5000,
  children,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const animationClasses = {
    entering:
      "transform translate-x-0 opacity-100 transition-all duration-200 ease-out",
    exiting:
      "transform translate-x-full opacity-0 transition-all duration-200 ease-in",
    initial: "transform translate-x-full opacity-0",
  };

  const getAnimationClass = () => {
    if (isExiting) return animationClasses.exiting;
    if (isVisible) return animationClasses.entering;
    return animationClasses.initial;
  };

  return (
    <div
      className={`
        bg-black border ${
          style === "success"
            ? "border-green-500"
            : style === "danger"
            ? "border-red-500"
            : style === "warning"
            ? "border-yellow-500"
            : style === "info"
            ? "border-blue-500"
            : "border-neutral-800"
        } rounded-lg shadow-lg
        ${getAnimationClass()}
      `}
      role="alert"
    >
      <div className="flex items-center justify-center gap-3 p-4">
        <NotificationIcon style={style} customIcon={icon} />
        <div className="flex-1 min-w-0">
          <NotificationContent style={style} variant={variant}>
            {children}
          </NotificationContent>
        </div>
        <button
          type="button"
          className="flex-shrink-0 text-white hover:text-gray-300 transition-colors p-1"
          onClick={handleClose}
          aria-label="Close"
        >
          <i className="fas fa-xmark text-sm" />
        </button>
      </div>
    </div>
  );
};

export { Notification };
