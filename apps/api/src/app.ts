import express, { Application, Router } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import { DiscordController } from "./modules/auth/DiscordController";
import healthRoutes from "./modules/health/HealthRoutes";
import authRoutes from "./modules/auth/AuthRoutes";
import guildRoutes from "./modules/guild/GuildRoutes";
import welcomeRoutes from "./modules/welcome/WelcomeRoutes";

const app: Application = express();
const router: Router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/guilds", guildRoutes);
router.use("/welcomes", welcomeRoutes);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "astra-discord-auth-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

DiscordController.initialize();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api", router);
export default app;
