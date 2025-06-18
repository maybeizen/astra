# Astra API with Discord Authentication

This API uses Discord OAuth for authentication and session-based user management.

## Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create a `.env` file based on `.env.example`
4. Set up a Discord application at https://discord.com/developers/applications
   - Create a new application
   - Go to OAuth2 settings
   - Add redirect URL: `http://localhost:3000/api/auth/discord/callback` (or your custom URL)
   - Copy Client ID and Client Secret to your `.env` file
5. Start the development server: `pnpm dev`

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development, production)
- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret for session encryption
- `DISCORD_CLIENT_ID`: Discord OAuth client ID
- `DISCORD_CLIENT_SECRET`: Discord OAuth client secret
- `DISCORD_CALLBACK_URL`: OAuth callback URL
- `CLIENT_URL`: Frontend URL for CORS
- `CLIENT_SUCCESS_REDIRECT`: Redirect URL after successful login
- `CLIENT_FAILURE_REDIRECT`: Redirect URL after failed login

## Authentication Flow

1. User visits `/api/auth/discord`
2. User is redirected to Discord for authentication
3. After authentication, Discord redirects to `/api/auth/discord/callback`
4. User session is created and user is redirected to success URL
5. Frontend can access `/api/auth/me` to get the current user

## API Endpoints

- `GET /api/auth/discord`: Start Discord OAuth flow
- `GET /api/auth/discord/callback`: Handle Discord OAuth callback
- `GET /api/auth/me`: Get current authenticated user
- `POST /api/auth/logout`: Logout current user

## User Model

The user model is based on Discord authentication:

- `id`: MongoDB document ID
- `email`: User email (from Discord or fallback)
- `discordId`: Discord user ID (unique identifier)
- `discordUsername`: Discord username
- `discordAvatar`: Discord avatar URL (optional)
- `discordEmail`: Email from Discord (optional)
- `discordAccessToken`: Discord OAuth access token
- `discordRefreshToken`: Discord OAuth refresh token
- `discordTokenExpires`: Token expiration date
