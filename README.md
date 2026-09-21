# Lyrical GraphQL Server

The API for **Lyrical**, a GraphQL application for creating songs, attaching lyrics, and liking lyrics. The server uses Express and GraphQL Yoga to expose a GraphQL endpoint, with MongoDB Atlas and Mongoose for persistence.

The companion Next.js client is located in [`../lyrical-next`](../lyrical-next/README.md).

## Technology

- Express 5
- GraphQL Yoga 5 and GraphQL
- MongoDB Atlas with Mongoose
- TypeScript executed by Node.js with experimental type stripping
- Nodemon for local development reloads

## Architecture

```text
Next.js client (port 3001)
  └── GraphQL Yoga /graphql (port 3000)
        └── Mongoose
              └── MongoDB Atlas
```

GraphiQL is enabled, so the API explorer is available at the same GraphQL endpoint during development.

## Prerequisites

- Node.js and pnpm.
- A MongoDB Atlas cluster and a database user.
- Network access from your current public IP address to the Atlas cluster.

Atlas blocks database connections by default. In the Atlas project, add your current public IP address under **Network Access → IP Access List**. If your ISP assigns a dynamic IP, update the entry when it changes or use a short-lived temporary entry for local development.

## Environment Variables

Create a `.env` file from the template:

```bash
cp .env.template .env
```

Set your Atlas connection string:

```dotenv
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority"
```

Never commit `.env` or share the connection string. Use a database user with only the permissions the application needs.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The server listens on port `3000` and exposes:

```text
http://localhost:3000/graphql
```

## GraphQL Schema

### Types

```graphql
type SongType {
  id: ID
  title: String
  lyrics: [LyricType]
}

type LyricType {
  id: ID
  content: String
  likes: Int
  song: SongType
}
```

### Queries

```graphql
query {
  songs {
    id
    title
  }
}
```

Available queries:

| Query | Arguments | Description |
| --- | --- | --- |
| `songs` | None | Returns all songs. |
| `song` | `id: ID!` | Returns one song, including its lyrics when requested. |
| `lyric` | `id: ID!` | Returns one lyric. |

### Mutations

Create a song:

```graphql
mutation AddSong($title: String) {
  addSong(title: $title) {
    id
    title
  }
}
```

Add a lyric to a song:

```graphql
mutation AddLyric($songId: ID, $content: String) {
  addLyricToSong(songId: $songId, content: $content) {
    id
    title
    lyrics {
      id
      content
      likes
    }
  }
}
```

Other available mutations are `likeLyric(id: ID)` and `deleteSong(id: ID)`.

## Data Model

- A `Song` has a title and a list of lyric identifiers.
- A `Lyric` has content, a like counter, and a reference to its parent song.
- Resolving `SongType.lyrics` loads the lyric documents associated with a song.

## Development Notes

- The server requires `MONGODB_URI` at startup and fails fast when it is missing.
- Connection status is logged after Mongoose opens or fails to open the MongoDB Atlas connection.
- The frontend currently queries this service from `http://localhost:3001` using Apollo Client.
