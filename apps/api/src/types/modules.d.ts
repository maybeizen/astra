declare module "passport-discord" {
  import { Request } from "express";
  import { Strategy as PassportStrategy } from "passport";

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    authorizationURL?: string;
    tokenURL?: string;
    customHeaders?: object;
  }

  export interface StrategyOptionsWithRequest extends StrategyOptions {
    passReqToCallback: boolean;
  }

  export interface Profile {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    email?: string;
    verified?: boolean;
    provider: string;
    accessToken: string;
    refreshToken: string;
    fetchedAt: Date;
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions | StrategyOptionsWithRequest,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any, info?: any) => void
      ) => void
    );
    userProfile(
      accessToken: string,
      done: (error: any, user?: any) => void
    ): void;
  }
}

declare module "express-session" {
  interface SessionData {
    passport: {
      user: string;
    };
  }
}
