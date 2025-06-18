"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/utils/env";
import { Guild, GuildList } from "@/components/guild";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/button";
import { ErrorPopup } from "@/components/guild/ErrorPopup";
import { useNotification } from "@/hooks";

interface GuildData {
  id: string;
  name: string;
  icon: string | null;
  in_server: boolean;
}

export default function Dashboard() {
  const [guilds, setGuilds] = useState<GuildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { success, error: showError, info } = useNotification();

  const fetchGuilds = useCallback(
    async (invalidateCache = false) => {
      try {
        setLoading(true);
        const response = await fetch(
          `${env.API_URL}/guilds/user${invalidateCache ? "?refresh=true" : ""}`,
          {
            credentials: "include",
            cache: invalidateCache ? "no-store" : "default",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch guilds: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setGuilds(data.guilds);
        setError(null);

        if (invalidateCache) {
          success("Servers refreshed successfully!", {
            duration: 3000,
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error(err);

        if (invalidateCache) {
          showError("Failed to refresh servers. Please try again.", {
            duration: 5000,
          });
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [success, showError]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchGuilds(true);
  }, [fetchGuilds]);

  const handleAddBot = useCallback(
    (guildId: string) => {
      info("Redirecting to Discord authorization page...", {
        variant: "banner",
      });
      window.open(
        `https://discord.com/api/oauth2/authorize?client_id=1345286002486280202&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}`,
        "_blank"
      );
    },
    [info]
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    fetchGuilds();
  }, [router, user, authLoading, fetchGuilds]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <i className="fas fa-spinner-third animate-spin text-4xl"></i>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorPopup
        error={error}
        onRetry={handleRefresh}
        isRetrying={isRefreshing}
        onGoHome={() => router.push("/")}
      />
    );
  }

  const addBotAction = (
    <Button
      variant="primary"
      icon="fas fa-discord"
      iconPosition="left"
      onClick={() => handleAddBot(guilds[0].id)}
    >
      Add Bot to Server
    </Button>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-md px-6 py-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Welcome, {user?.discordUsername}!
            </h1>
            <p className="text-neutral-400 max-w-3xl">
              Manage your Discord servers with powerful tools and features.
              Select a server below to get started.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              variant="glass"
              size="sm"
              icon="fas fa-rotate"
              iconPosition="left"
              onClick={handleRefresh}
              loading={isRefreshing}
            >
              Refresh Servers
            </Button>
          </div>
        </div>
      </div>

      <GuildList
        title="Your Servers"
        emptyMessage="You don't have administrator access to any Discord servers."
        emptyAction={addBotAction}
      >
        {guilds.map((guild) => (
          <Guild
            key={guild.id}
            id={guild.id}
            name={guild.name}
            icon={guild.icon}
            in_server={guild.in_server}
          />
        ))}
      </GuildList>
    </div>
  );
}
