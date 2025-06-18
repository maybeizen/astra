"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { env } from "@/utils/env";
import { useNotification } from "@/hooks";
import { Button } from "@/components/button";

interface GuildDetails {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  owner: boolean;
  features: string[];
}

export default function GuildPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { error, warning } = useNotification();
  const [guild, setGuild] = useState<GuildDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <i className="fas fa-spinner-third animate-spin text-4xl"></i>
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-900/20 border border-red-800 rounded-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Guild Not Found</h2>
          <p className="text-neutral-300 mb-4">
            We couldn&apos;t find the guild you&apos;re looking for.
          </p>
          <Button variant="primary" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-md px-6 py-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {guild.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                alt={guild.name}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <span className="text-xl font-bold">
                  {guild.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {guild.name}
              </h1>
              <p className="text-neutral-400">
                {guild.memberCount} members • {guild.owner ? "Owner" : "Admin"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="glass"
              size="sm"
              icon="fas fa-arrow-left"
              iconPosition="left"
              onClick={() => router.push("/dashboard")}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
