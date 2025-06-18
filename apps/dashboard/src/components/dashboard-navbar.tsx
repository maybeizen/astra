"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "./navbar/navbar";
import { NavbarLink } from "./navbar/navbar-link";
import Dropdown from "./dropdown/dropdown";
import DropdownItem from "./dropdown/item";
import DropdownDivider from "./dropdown/divider";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardNavbar() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const getAvatarUrl = () => {
    if (user?.discordAvatar) {
      return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`;
    }
    return "/default-avatar.png";
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Navbar>
      <Navbar.Left>
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Astra
          </span>
        </Link>
      </Navbar.Left>

      <Navbar.Center>
        <div className="hidden md:flex items-center space-x-6">
          <NavbarLink href="/dashboard" exact>
            Overview
          </NavbarLink>
          <NavbarLink href="/dashboard/servers">Servers</NavbarLink>
          <NavbarLink href="/dashboard/settings">Settings</NavbarLink>
          <NavbarLink href="/dashboard/support">Support</NavbarLink>
        </div>
      </Navbar.Center>

      <Navbar.Right>
        <div className="flex items-center">
          {user ? (
            <Dropdown
              label={
                <div className="flex items-center space-x-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={getAvatarUrl()}
                      alt={user.discordUsername}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user.discordUsername}
                  </span>
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              }
            >
              <DropdownItem
                item={{
                  label: "Your Profile",
                  icon: "fa-solid fa-user",
                  href: "/dashboard/profile",
                }}
              />
              <DropdownItem
                item={{
                  label: "Settings",
                  icon: "fa-solid fa-gear",
                  href: "/dashboard/settings",
                }}
              />
              <DropdownDivider />
              <div
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm transition hover:bg-neutral-800/80 text-red-400"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </div>
            </Dropdown>
          ) : (
            <button
              onClick={login}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <i className="fab fa-discord mr-2" />
              Login with Discord
            </button>
          )}
        </div>
      </Navbar.Right>
    </Navbar>
  );
}
