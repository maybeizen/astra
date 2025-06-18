"use client";

import React from "react";

interface GuildListProps {
  children: React.ReactNode;
  title?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

export function GuildList({
  children,
  title = "Your Servers",
  emptyMessage = "You don't have access to any Discord servers.",
  emptyAction,
}: GuildListProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}

      {childrenArray.length === 0 ? (
        <div className="text-center py-10 bg-neutral-900/70 backdrop-blur-md rounded-xl border border-neutral-800 p-6 sm:p-8">
          <div className="text-5xl sm:text-6xl mb-6 text-neutral-700">
            <i className="fa-solid fa-server"></i>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
            No servers found
          </h3>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">
            {emptyMessage}
          </p>
          {emptyAction}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {children}
        </div>
      )}
    </div>
  );
}
