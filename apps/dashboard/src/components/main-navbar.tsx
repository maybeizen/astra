"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./navbar/navbar";
import { NavbarLink } from "./navbar/navbar-link";
import { MobileMenu } from "./navbar/mobile-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { env } from "@/utils/env";
import { Button } from "./button";

export const MainNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${env.API_URL}/auth/me`, {
          credentials: "include",
        });

        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <Navbar>
      <Navbar.Left>
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Astra
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          <NavbarLink href="/" exact>
            Home
          </NavbarLink>
          <NavbarLink href="/features">Features</NavbarLink>
          <NavbarLink href="/docs">Docs</NavbarLink>
          <NavbarLink href="/support">Support</NavbarLink>
        </div>
      </Navbar.Left>

      <Navbar.Right>
        <div className="hidden md:block">
          {isLoggedIn ? (
            <Button
              onClick={() => router.push("/dashboard")}
              variant="primary"
              rounded="md"
              size="sm"
            >
              Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => router.push(env.DISCORD_AUTH_URL)}
              variant="primary"
              rounded="md"
              size="sm"
              icon="fab fa-discord"
            >
              Login with Discord
            </Button>
          )}
        </div>

        <MobileMenu className="md:hidden">
          <NavbarLink href="/" exact className="block py-2 w-full">
            Home
          </NavbarLink>
          <NavbarLink href="/features" className="block py-2 w-full">
            Features
          </NavbarLink>
          <NavbarLink href="/docs" className="block py-2 w-full">
            Docs
          </NavbarLink>
          <NavbarLink href="/support" className="block py-2 w-full">
            Support
          </NavbarLink>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {isLoggedIn ? (
              <Button
                onClick={() => router.push("/dashboard")}
                variant="primary"
                rounded="md"
                size="sm"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => router.push(env.DISCORD_AUTH_URL)}
                variant="primary"
                rounded="md"
                size="sm"
                icon="fab fa-discord"
              >
                Login with Discord
              </Button>
            )}
          </div>
        </MobileMenu>
      </Navbar.Right>
    </Navbar>
  );
};
