import type { BotConfig } from "../types/global";

const config: BotConfig = {
  staff: {
    staffRoleIds: [
      "1069001432805679184",
      "1004920336120283260",
      "1099140463321165896",
      "1004920336120283262",
    ], // support team, trainee, admin, manager
  },
  tickets: {
    parentCategoryId: "1064379366496288818",
    closedCategoryId: "1319854826347171961",
  },
  autorole: {
    communityRoleId: "1004920336120283257",
  },
};

export default config;
