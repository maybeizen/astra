export interface BotConfig {
  staff: {
    staffRoleIds: string[];
  };
  tickets: {
    parentCategoryId: string;
    closedCategoryId: string;
  };
  autorole: {
    communityRoleId: string;
  };
}

export interface Ticket {
  userId: string;
  ticketId: string;
  name: string;
  status: "open" | "closed" | "deleted";
  department: "general" | "billing" | "technical" | "advertising" | "other";
  claim: {
    status: boolean;
    claimedBy?: string;
    claimedAt?: number;
  };
  timestamps: {
    createdAt: number;
    attendedToAt?: number;
    closedAt?: number;
    deletedAt?: number;
    firstResponseAt?: number;
    reopenedAt?: number;
  };
  responseTime?: number;
}

// export interface AdApplication {
//   userId: string;
//   adId: string;
//   status: "pending" | "approved" | "rejected";

//   company?: string;
//   contactEmail?: string;
//   advertiserURL: string;

//   metadata: {
//     adName: string;
//     adDescription: string;
//     adLink: string;
//     adType: "image" | "video" | "gif";
//   };

//   reviewer?: {
//     reviewerId: string;
//     notes?: string;
//   };

//   timestamps: {
//     createdAt: number;
//     updatedAt: number;
//     approvedAt?: number;
//     rejectedAt?: number;
//   };
// }

export interface User {
  userId: string;
  isStaff: boolean;
  timestamps: {
    joinedAt?: number;
    leftAt?: number;
    createdAt?: number;
  };
}

export interface Giveaway {
  id: number;
  prize: string;
  duration: number;
  messageId: string;
  channelId: string;
  winnerCount: number;
  requiredRole: string | null;
  pingRole: string | null;
  startTime: number;
  endTime: number;
  participants: string[];
  winners: string[];
  ended: boolean;
}

export interface GiveawaySettings {
  totalGiveaways: number;
  access: "ENABLED" | "DISABLED";
  defaultDuration: number;
  defaultWinnerCount: number;
  autoReroll: boolean;
  requiredRoleId?: string;
  allowedRoles?: string[];
  bannedUsers?: Array<{
    userId: string;
    moderator: string;
    reason?: string;
    bannedAt: Date;
  }>;
}
