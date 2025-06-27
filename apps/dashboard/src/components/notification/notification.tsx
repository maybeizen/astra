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
    }, 300);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const variantClasses = {
    toast: "max-w-sm shadow-lg rounded-lg overflow-hidden",
  };

  const positionClasses: Record<NotificationVariant, string> = {
    toast: "",
  };

  const styleClasses = {
    primary: "bg-indigo-600/90 text-white border-l-4 border-indigo-400",
    secondary: "bg-slate-800/90 text-white border-l-4 border-slate-400",
    info: "bg-blue-600/90 text-white border-l-4 border-blue-400",
    success: "bg-emerald-600/90 text-white border-l-4 border-emerald-400",
    warning: "bg-amber-600/90 text-white border-l-4 border-amber-400",
    danger: "bg-rose-600/90 text-white border-l-4 border-rose-400",
  };

  const animationClasses = {
    entering: {
      toast:
        "transform translate-x-0 opacity-100 scale-100 transition-all duration-300 ease-out",
    },
    exiting: {
      toast:
        "transform translate-x-full opacity-0 scale-95 transition-all duration-300 ease-in",
    },
    initial: {
      toast: "transform translate-x-full opacity-0 scale-95",
    },
  };

  const getAnimationClass = () => {
    if (isExiting) return animationClasses.exiting[variant];
    if (isVisible) return animationClasses.entering[variant];
    return animationClasses.initial[variant];
  };

  return (
    <div
      className={`
        notification 
        ${variantClasses[variant]} 
        ${positionClasses[variant]} 
        ${styleClasses[style]} 
        ${getAnimationClass()} 
        backdrop-blur-sm 
        shadow-md
        ring-1 ring-white/10
        will-change-transform
      `}
      role="alert"
    >
      <div className="flex items-center gap-3 p-4">
        <NotificationIcon style={style} customIcon={icon} />
        <NotificationContent style={style} variant={variant}>
          {children}
        </NotificationContent>
        <button
          type="button"
          className="notification-close ml-auto text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          onClick={handleClose}
          aria-label="Close"
        >
          <i className="fas fa-xmark" />
        </button>
      </div>
    </div>
  );
};

export { Notification };
