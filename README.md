# Habitica Bluesky Labeler

Automatically displays your Habitica stats and achievements on your Bluesky profile!

Features:
- Syncs your Habitica info to Bluesky profile labels
- Easy setup - just DM your User ID to the bot
- Auto-updates your stats periodically

Try it out: [@habitica.solimaniac.com](https://bsky.app/profile/habitica.solimaniac.com)
## Prerequisites

- [Node.js](https://nodejs.org/) 21 or later
- [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/)

## Setup

For setup instructions, reference the [Bluesky Labeler Starter Kit](https://github.com/aliceisjustplaying/labeler-starter-kit-bsky?tab=readme-ov-file#setup) instructions.

Note: as this labeler operates differently from traditional post like-based labelers, the set-posts functionality has been removed. Ensure you create a delete post manually and update the `DELETE_POST_REF` environment variable accordingly.

## Credits

- [alice](https://bsky.app/profile/did:plc:by3jhwdqgbtrcc7q4tkkv3cf), creator of the [Bluesky Labeler Starter Kit](https://github.com/aliceisjustplaying/labeler-starter-kit-bsky) this project was built with
- [futur](https://bsky.app/profile/did:plc:uu5axsmbm2or2dngy4gwchec), creator of the [skyware libraries](https://skyware.js.org/), a great set of tools for working with atproto & building labelers.
