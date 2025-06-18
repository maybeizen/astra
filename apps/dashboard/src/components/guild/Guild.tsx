"use client";

import Image from "next/image";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";

export interface GuildProps {
  id: string;
  name: string;
  icon: string | null;
  in_server: boolean;
}

export function Guild({ id, name, icon, in_server }: GuildProps) {
  const router = useRouter();
  const getGuildIcon = () =>
    icon
      ? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
      : "/placeholder-guild.png";

  const handleAddBot = (guildId: string) => {
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=1345286002486280202&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}`,
      "_blank"
    );
  };

  return (
    <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md hover:backdrop-blur-lg hover:bg-neutral-800/75 transition-all duration-300 overflow-hidden group h-full">
      <div className="flex items-center p-4 sm:p-5 gap-3 sm:gap-5 h-full">
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden bg-neutral-700">
          <Image
            src={getGuildIcon()}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 48px, 64px"
          />
        </div>

        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-neutral-100 truncate">
            {name}
          </h3>
          <span className="mt-0.5 sm:mt-1 text-xs font-medium text-neutral-400">
            Administrator
          </span>
        </div>

        <div className="hidden md:block">
          {in_server ? (
            <Button
              variant="glass"
              size="sm"
              icon="fa-solid fa-gear"
              iconPosition="left"
              onClick={() => router.push(`/dashboard/${id}`)}
            >
              Manage
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon="fa-solid fa-plus"
              iconPosition="left"
              onClick={() => handleAddBot(id)}
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
