import type { User, GuildMember, Client } from "discord.js";
import type { CommandKit } from "commandkit";
import { registerUser } from "../../utils/register";

export default function (
  member: GuildMember,
  client: Client<true>,
  handler: CommandKit
) {
  try {
    registerUser(member.user);
  } catch (error: any) {
    console.error(error);
    console.error(error.stack);
  }
}
