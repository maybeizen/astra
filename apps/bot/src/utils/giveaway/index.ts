// Copyright 2025 Nether Host
import StartGiveaway from "./start-giveaway";
import EndGiveaway from "./end-giveaway";
import GetGiveawayInfo from "./get-giveaway-info";
import ListGiveaways from "./list-giveaways";
import RerollGiveaway from "./reroll-giveaway";
import Participate from "./participate";
import CheckGiveaway from "./check-giveaway";

class Giveaway {
  constructor() {}

  public start() {
    return new StartGiveaway();
  }

  public end() {
    return new EndGiveaway();
  }

  public info() {
    return new GetGiveawayInfo();
  }

  public list() {
    return new ListGiveaways();
  }

  public reroll() {
    return new RerollGiveaway();
  }

  public participate() {
    return new Participate();
  }

  public check() {
    return new CheckGiveaway();
  }
}

export default Giveaway;
