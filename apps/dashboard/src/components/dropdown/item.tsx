import Link from "next/link";
import React from "react";

type Method = "get" | "post" | "put" | "patch" | "delete";

interface DropdownItemProps {
  item: {
    label: string;
    icon: string;
    href: string;
  };
  method?: Method;
  className?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  item,
  className,
  method = "get",
}) => {
  if (method !== "get") {
    return (
      <a
        href={item.href}
        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm transition hover:bg-neutral-800/80 ${className}`}
      >
        <i className={item.icon}></i>
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm transition hover:bg-neutral-800/80 ${className}`}
    >
      <i className={item.icon}></i>
      {item.label}
    </Link>
  );
};

export default DropdownItem;
