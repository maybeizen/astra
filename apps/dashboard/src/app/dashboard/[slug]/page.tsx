"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { env } from "@/utils/env";
import { useNotification } from "@/hooks";
import { Button } from "@/components/button";
import { GuildNavSelector } from "@/components/guild/nav/selector";
import {
  Overview,
  Welcome,
  Moderation,
  Commands,
  Tickets,
  Levels,
  Embeds,
  Economy,
  Giveaways,
  Logs,
} from "@/components/guild/sections";

interface GuildDetails {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  owner: boolean;
  features: string[];
}

const validTabs = [
  "overview",
  "welcome",
  "moderation",
  "commands",
  "tickets",
  "levels",
  "embeds",
  "economy",
  "giveaways",
  "logs",
];

export default function GuildPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error, warning } = useNotification();
  const [guild, setGuild] = useState<GuildDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  useEffect(() => {
    const fetchGuildDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${env.API_URL}/guilds/${slug}`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 404) {
            error("Guild not found", { duration: 5000 });
            router.push("/dashboard");
            return;
          }

          if (response.status === 403) {
            warning("You don't have permission to view this guild", {
              duration: 5000,
            });
            router.push("/dashboard");
            return;
          }

          throw new Error(`Error fetching guild: ${response.status}`);
        }

        const data = await response.json();
        setGuild(data);
      } catch (err) {
        console.error(err);
        error("Failed to load guild details", { duration: 5000 });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGuildDetails();
    }
  }, [slug, router, error, warning]);

  const renderActiveComponent = () => {
    if (!guild) return null;

    const components = {
      overview: <Overview guild={guild} />,
      welcome: <Welcome guild={guild} />,
      moderation: <Moderation guild={guild} />,
      commands: <Commands guild={guild} />,
      tickets: <Tickets guild={guild} />,
      levels: <Levels guild={guild} />,
      embeds: <Embeds guild={guild} />,
      economy: <Economy guild={guild} />,
      giveaways: <Giveaways guild={guild} />,
      logs: <Logs guild={guild} />,
    };

    return (
      components[activeTab as keyof typeof components] || (
        <Overview guild={guild} />
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading guild settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-8 text-center backdrop-blur-sm">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-2xl text-red-400"></i>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-red-100">
              Guild Not Found
            </h2>
            <p className="text-neutral-300 mb-6 max-w-md mx-auto">
              We couldn&apos;t find the guild you&apos;re looking for. It may
              have been deleted or you may have lost access.
            </p>
            <Button variant="primary" onClick={() => router.push("/dashboard")}>
              <i className="fas fa-arrow-left mr-2"></i>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="border-b border-neutral-800/50 bg-neutral-950 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                    alt={guild.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-neutral-700/50 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <i className="fab fa-discord text-2xl text-white"></i>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                  <i className="fas fa-check text-xs text-white"></i>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {guild.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-neutral-400">
                    <i className="fas fa-users mr-1"></i>
                    {guild.memberCount.toLocaleString()} members
                  </span>
                  <span className="text-sm text-neutral-400">
                    <i className="fas fa-crown mr-1"></i>
                    {guild.owner ? "Owner" : "Admin"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="glass"
                size="sm"
                icon="fas fa-arrow-left"
                iconPosition="left"
                onClick={() => router.push("/dashboard")}
                className="backdrop-blur-sm"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <GuildNavSelector
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-neutral-900 backdrop-blur-sm rounded-xl border border-neutral-800/50 shadow-xl">
              {renderActiveComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
